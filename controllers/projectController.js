// Carlos

const Project = require('../models/Project'); 

// Crear un nuevo proyecto
exports.createProject = async (req, res) => {
    const { name, description } = req.body;

    try {
        const newProject = new Project({
            name,
            description
        });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el proyecto' });
    }
};

// Eliminar un proyecto
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await Project.findByIdAndDelete(id);
        res.status(200).json({ message: 'Proyecto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el proyecto' });
    }
};
