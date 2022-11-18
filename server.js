const express = require('express');
const fs = require('fs');
const PORT = 5000;
const app = express();
let uploaders = fs.readFileSync(process.cwd() + "/database/uploaders.json", "utf-8").trim() || "[]";
uploaders = JSON.parse(uploaders)

let images = fs.readFileSync(process.cwd() + "/database/images.json", "utf-8").trim() || "[]";
images = JSON.parse(images)

let videos = fs.readFileSync(process.cwd() + "/database/videos.json", "utf-8").trim() || "[]";
videos = JSON.parse(videos)

let documents = fs.readFileSync(process.cwd() + "/database/documents.json", "utf-8").trim() || "[]";
documents = JSON.parse(documents)

app.use(express.json());

app.get('/uploaders', (req,res) => {
    uploaders = uploaders.map((uploader) => {
        const findImage = images.filter((img) => img.uploaderId == uploader.id);
        uploader.images = findImage;
        return uploader;
    })
    uploaders = uploaders.map((uploader) => {
        const findVideo = videos.filter((vid) => vid.uploaderId == uploader.id);
        uploader.videos = findVideo;
        return uploader;
    })
    uploaders = uploaders.map((uploader) => {
        const findDoc = documents.filter((doc) => doc.uploaderId == uploader.id);
        uploader.documents = findDoc;
        return uploader;
    })
    res.status(200).json(uploaders);
})

app.post('/uploaders', (req, res) => {
    const { username, password } = req.body;

    if(!username || !password){
        return res.status(400).json({
            message: "Please enter username and password",
            status: 400
        })
    }
    const findUploader = uploaders.find((el) => el.username == username);
    if(findUploader){
        return res.status(400).json({
            message: "Username should be unique please create your own!",
            status: 400
        })
    }

    const newUSer = {
        id: uploaders.length ? uploaders[uploaders.length - 1].id + 1 : 1,
        username,
        password,
    }

    uploaders.push(newUSer);

    fs.writeFileSync(__dirname + "/database/uploaders.json", JSON.stringify(uploaders, null, 2));
    
    res.status(201).json({
        message: "New user created!",
        status: 201
    })
})


//======================================IMAGES===================================


app.get('/images', (req,res) => {
    images = images.map((img) => {
        const findUploader = uploaders.find((uploader) => uploader.id == img.uploaderId);
        img.uploader = findUploader;
        delete img.uploaderId;
        return img;
    })
    res.status(200).json(images);
})

app.post('/images', (req, res) => {
    const { name, uploaderId } = req.body;

    if(!name || !uploaderId){
        return res.status(400).json({
            message: "Please enter name and uploader's id",
            status: 400
        })
    }

    const findUploader = uploaders.find((el) => el.id == uploaderId);
    if(!findUploader){
        return res.status(404).json({
            message: "Uploader not found",
            status: 404
        })
    }

    const newImg = {
        id: images.length ? images[images.length - 1].id + 1 : 1,
        name,
        uploaderId,
    }

    images.push(newImg);
    

    fs.writeFileSync(__dirname + "/database/images.json", JSON.stringify(images, null, 2));

    res.status(201).json({
        message: "New image posted",
        status: 201
    })
})

//=======================================VIDEOS============================

app.get('/videos', (req,res) => {
    videos = videos.map((vid) => {
        const findUploader = uploaders.find((uploader) => uploader.id == vid.uploaderId);
        vid.uploader = findUploader;
        delete vid.uploaderId;
        return vid;
    })
    res.status(200).json(videos);
})

app.post('/videos', (req, res) => {
    const { name, uploaderId } = req.body;

    if(!name || !uploaderId){
        return res.status(400).json({
            message: "Please enter name and uploader's id",
            status: 400
        })
    }

    const findUploader = uploaders.find((el) => el.id == uploaderId);
    if(!findUploader){
        return res.status(404).json({
            message: "Uploader not found",
            status: 404
        })
    }

    const newVid = {
        id: videos.length ? videos[videos.length - 1].id + 1 : 1,
        name,
        uploaderId,
    }

    videos.push(newVid);

    fs.writeFileSync(__dirname + "/database/vidoes.json", JSON.stringify(videos, null, 2));

    res.status(201).json({
        message: "New video posted",
        status: 201
    })
})

//====================================DOCUMENTS==========================


app.get('/documents', (req,res) => {
    documents = documents.map((vid) => {
        const findUploader = uploaders.find((uploader) => uploader.id == doc.uploaderId);
        doc.uploader = findUploader;
        delete doc.uploaderId;
        return doc;
    })
    res.status(200).json(documents);
})

app.post('/documents', (req, res) => {
    const { name, uploaderId } = req.body;

    if(!name || !uploaderId){
        return res.status(400).json({
            message: "Please enter name and uploader's id",
            status: 400
        })
    }

    const findUploader = uploaders.find((el) => el.id == uploaderId);
    if(!findUploader){
        return res.status(404).json({
            message: "Uploader not found",
            status: 404
        })
    }

    const newDoc = {
        id: documents.length ? documents[documents.length - 1].id + 1 : 1,
        name,
        uploaderId,
    }

    documents.push(newDoc);

    fs.writeFileSync(__dirname + "/database/documents.json", JSON.stringify(documents, null, 2));

    res.status(201).json({
        message: "New video posted",
        status: 201
    })
})

app.listen(PORT, () => {
    console.log("Server is running on http://localhost:", PORT);
})