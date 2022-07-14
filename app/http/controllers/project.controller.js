const { ProjectModel } = require("../../models/project");
const autoBind = require("auto-bind");
const { createLinkForImages } = require("../../modules/functions");
const path = require("path");
const fs = require("fs");

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
      for (const project of projects) {
        project.image = createLinkForImages(project.image, req);
      }
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
      project.image = createLinkForImages(project.image, req);
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
      const project = await this.findProject(projectId, owner);
      const projectImagePath = path.join(__dirname, "..", "..", "..", "public", project?.image);
      const result = await ProjectModel.deleteOne({_id : projectId});
      if(result.deletedCount == 0) throw { status : 400, message : "حذف پروژه انجام نشد"};
      fs.unlinkSync(projectImagePath);
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
  async updateProject(req, res, next) {
    try {
      const owner = req.user._id;
      const projectId = req.params.id;
      await this.findProject(projectId, owner);
      const data = {...req.body};
      Object.entries(data).forEach(([key, value]) => {
        if(!["title", "text", "tags"].includes(key)) delete data[key];
        if(["", " ", 0, -1, null, undefined, NaN].includes(value)) delete data[key];
        if(key == "tags" && data['tags'].constructor === Array){
          data['tags'] = data['tags'].filter(item => {
            if(!["", " ", 0, -1, null, undefined, NaN].includes(item)) return item;
          })
          if(data['tags'].length == 0) delete data['tags'];
        }
      })
      const result = await ProjectModel.updateOne({_id : projectId}, {$set : data});
      if(result.modifiedCount == 0) throw { status : 400, message : "ویرایش پروژه انجام نشد"};
      return res.status(200).json({
        status : 200,
        success : true,
        message : "ویرایش پرژه با موفقیت انجام شد"
      });
    } catch (error) {
      next(error)
    }
  }
  async updateProjectImage(req, res ,next){
    try {
      const {image} = req.body;
      const owner = req.user._id;
      const projectId = req.params.id;
      await this.findProject(projectId, owner);
      const result = await ProjectModel.updateOne({_id : projectId}, {$set : {image}});
      if(result.modifiedCount == 0) throw {status : 400, message : "ویرایش تصویر پروژه انجام نشد"};
      return res.status(200).json({
        status : 200,
        success : true,
        message : "ویرایش تصویر پرژه با موفقیت انجام شد"
      });
    } catch (error) {
      next(error)
    }
  }
  getProjectsOfTeam() {}
  getProjectsOfUser() {}
  async findProject(projectId, owner){
    const project = await ProjectModel.findOne({owner, _id : projectId});
    if(!project) throw { status : 400, message : "پروژه ای یافت نشد"};
    return project;
  }
}

module.exports = {
  ProjectController: new ProjectController(),
};
