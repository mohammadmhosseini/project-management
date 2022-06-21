const { ProjectModel } = require("../../models/project");
const autoBind = require("auto-bind");

class ProjectController {
  constructor(){
    autoBind(this);
  }
  async createProject(req, res ,next) {
    try {
        const {title, text, image, tags} = req.body;
        const { _id } = req.user;

        const result = await ProjectModel.create({
          title,
          text,
          owner : _id,
          image,
          tags
        });
        if(!result) throw { status : 400, message: "افزودن پروژه با مشکل مواجه شد"};
        return res.status(201).json({
          status : 201,
          success :true,
          message : "افزودن پروژه با موفقیت انجام شد"
        });
    } catch (error) {
        next(error)
    }
  }
  async getAllProjects(req, res, next) {
    try {
      const owner = req.user._id;
      const projects = await ProjectModel.find({owner});
      return res.status(200).json({
        status : 200,
        success : true,
        projects
      }); 
    } catch (error) {
      next(error)
    }
  }
  async getProjectById(req, res, next) {
    try {
      const owner = req.user._id;
      const projectId = req.params.id;
      const project = await this.findProject(projectId, owner);
      project.image = req.protocol + "://" + req.get("host") + "/" + project.image;
      return res.status(200).json({
        status : 200,
        success : true,
        project
      });
    } catch (error) {
      next(error)
    }
  }
  async removeProject(req, res, next) {
    try {
      const owner = req.user._id;
      const projectId = req.params.id;
      await this.findProject(projectId, owner);
      const result = await ProjectModel.deleteOne({_id : projectId});
      if(result.deletedCount == 0) throw { status : 400, message : "حذف پروژه انجام نشد"};
      return res.status(200).json({
        status : 200,
        success : true,
        message : "پروژه با موفقیت حذف شد"
      });
    } catch (error) {
      console.log(error);
      next(error)
    }
  }
  getProjectsOfTeam() {}
  getProjectsOfUser() {}
  updateProject() {}
  async findProject(projectId, owner){
    const project = await ProjectModel.findOne({owner, _id : projectId});
    if(!project) throw { status : 400, message : "پروژه ای یافت نشد"};
    return project;
  }
}

module.exports = {
  ProjectController: new ProjectController(),
};
