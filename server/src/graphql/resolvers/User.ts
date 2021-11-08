import { User } from "../../entities/User";
import { MyContext } from "../../types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2";

// used for arguments
@InputType()
class UserInput {

    @Field()
    username: string;

    @Field({nullable: true})
    name?: string;

    @Field()
    password: string;
}


@ObjectType()
class FieldError {

    @Field()
    field: string;

    @Field()
    message: string;
}

// returns from mutations
@ObjectType()
class UserResponse {

    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User
}   

@Resolver()
export class  UserResolver {
    @Query(() => [User])
    users(
        @Ctx() {em}: MyContext
    ){
        return em.find(User, {})
    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UserInput,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse>{
        if(options.username.length <= 3){
            return{
                errors: [{
                    field: 'username',
                    message: 'username is short'
                }]
            }
        }
        if(options.password.length <= 3){
            return {
                errors: [{
                    field: 'password',
                    message: 'password is short'
                }]
            }
        }
        const passhash = await argon2.hash(options.password);
        const user = em.create(User, {username: options.username, password: passhash, name: options.name, type: ""});
        try{
            await em.persistAndFlush(user);
        }catch (err){
            if(err.code === '23505'){
                return {
                    errors: [{
                        field: "username",
                        message: "Duplicate username"
                    }]
                }
            }
        }
        return {user};
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UserInput,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, {username: options.username});
        
        if(!user){
            return {
                errors: [{
                    field: 'username',
                    message: "Couldn't find username"
                }]
            }
        }

        const valid = await argon2.verify(user.password, options.password);
        if(!valid){
            return {
                errors: [{
                    field: 'password',
                    message: "Password is bad"
                }]
            }
        }

        return {
            user,
        };
    }

}