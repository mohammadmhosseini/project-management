const { ProjectModel } = require("../../models/project");

class ProjectController {
  async createProject(req, res ,next) {
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
  }
  async getAllProjects(req, res, next) {
    const owner = req.user._id;

    const projects = await ProjectModel.find({owner});
    return res.status(200).json({
      status : 200,
      success : true,
      projects
    }); 
  }
  getProjectById() {}
  getProjectsOfTeam() {}
  getProjectsOfUser() {}
  updateProject() {}
  removeProject() {}
}

module.exports = {
  ProjectController: new ProjectController(),
};
