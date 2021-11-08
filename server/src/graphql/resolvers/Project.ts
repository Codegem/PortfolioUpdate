import { Project } from "../../entities/Project";
import { MyContext } from "../../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class ProjectResolver {
    @Query(() => [Project])
    projects(
        @Ctx() {em}: MyContext
    ){
        return em.find(Project, {});
    }

    @Query(() => Project, {nullable: true})
    project(
        // values on chema "id"
        @Arg("id") id: number,
        @Ctx() {em}: MyContext
    ): Promise<Project | null>{
        return em.findOne(Project, {id});
    }

    @Mutation(() => Project)
    async createProject(
        @Arg("name") name: string,
        @Ctx() {em}: MyContext
    ): Promise<Project | null>{
        const project = em.create(Project, {name});
        await em.persistAndFlush(project)
        return project;
    }

    @Mutation(() => Project, {nullable: true})
    async updateProject(
        @Arg("id") id: number,
        @Arg("name", () => String, {nullable: true}) name: string,
        @Ctx() {em}: MyContext
    ): Promise<Project | null>{
        const project = await em.findOne(Project, {id});
            if(!project){
                return null;
            }
            if(typeof name !== undefined){
                project.name = name
                await em.persistAndFlush(project);
            }
            return project;
        }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id") id: number,
        @Ctx() {em}: MyContext
    ): Promise<boolean>{
            await em.nativeDelete(Project, {id});
            return true;
        }
}