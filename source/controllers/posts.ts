// import { Request, Response, NextFunction } from 'express';
import { Response, NextFunction } from "express";
// import axios, { AxiosResponse } from 'axios';
import { db } from "../config/firebase";

// interface Post {
//     userId: Number;
//     id: Number;
//     title: String;
//     body: String;
// }

// // getting all posts
// const getPosts = async (req: Request, res: Response, next: NextFunction) => {
//     // get some posts
//     let result: AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
//     let posts: [Post] = result.data;
//     return res.status(200).json({
//         message: posts
//     });
// };

// // getting a single post
// const getPost = async (req: Request, res: Response, next: NextFunction) => {
//     // get the post id from the req
//     let id: string = req.params.id;
//     // get the post
//     let result: AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
//     let post: Post = result.data;
//     return res.status(200).json({
//         message: post
//     });
// };

// // updating a post
// const updatePost = async (req: Request, res: Response, next: NextFunction) => {
//     // get the post id from the req.params
//     let id: string = req.params.id;
//     // get the data from req.body
//     let title: string = req.body.title ?? null;
//     let body: string = req.body.body ?? null;
//     // update the post
//     let response: AxiosResponse = await axios.put(`https://jsonplaceholder.typicode.com/posts/${id}`, {
//         ...(title && { title }),
//         ...(body && { body })
//     });
//     // return response
//     return res.status(200).json({
//         message: response.data
//     });
// };

// // deleting a post
// const deletePost = async (req: Request, res: Response, next: NextFunction) => {
//     // get the post id from req.params
//     let id: string = req.params.id;
//     // delete the post
//     let response: AxiosResponse = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
//     // return response
//     return res.status(200).json({
//         message: 'post deleted successfully'
//     });
// };

// adding a post
type EntryType = {
    title: string,
    text: string
}
  
type Request = {
body: EntryType,
params: { entryId: string }
}

const getPosts = async(req: Request, res: Response, next: NextFunction) => {
    const allEntries: EntryType[] = []
    const querySnapshot = await db.collection('entries').get()

    // if (querySnapshot.exists()) {
    // console.log("Document data:", querySnapshot.data());
    // } else {
    // // doc.data() will be undefined in this case
    // console.log("No such document!");
    // }
    // querySnapshot.then(
    //     (querySnapshot: any) => {
    //         if(!querySnapshot.empty){
    //             querySnapshot.array.forEach((doc : any) => allEntries.push(doc.data()));
    //         }
    //     }
    // )
    querySnapshot.docs.forEach((doc: any) => allEntries.push(doc.data()))
    return res.status(200).json(allEntries)
}

// getting a single post
const getPost = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from the req
    let id: string = req.params.entryId;
    const singleEntry: EntryType[] = []
    const querySnapshot = await db.collection('entries').doc(id).get()
    singleEntry.push(querySnapshot.data())
    // get the post
    // let result: AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
    // let post: Post = result.data;
    // return res.status(200).json({
    //     message: post
    // });
    return res.status(200).json(singleEntry);
};

const addPost = async (req: Request, res: Response, next: NextFunction) => {
    // get the data from req.body
    // let title: string = req.body.title;
    // let body: string = req.body.body;
    // // add the post
    // let response: AxiosResponse = await axios.post(`https://jsonplaceholder.typicode.com/posts`, {
    //     title,
    //     body
    // });
    // // return response
    // return res.status(200).json({
    //     message: response.data
    // });
    const {title, text} = req.body;
    // try{
    const entry = db.collection('entries').doc()
    const entryObject = {
        id: entry.id,
        title,
        text,
    }

    await entry.set(entryObject)
    res.status(200).send({
        status: 'success',
        message: 'entry added successfully',
        data: entryObject
    })
    // } 
    // catch(error){
    //     res.status(500).json(error.message);
    // }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    // get the post id from req.params
    const {entryId} = req.params;
    const entry = db.collection('entries').doc(entryId)
    await entry.delete()
    
    // delete the post
    // let response: AxiosResponse = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
    // return response
    return res.status(200).json({
        status: 'success',
        message: 'post deleted successfully'
    });
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
    const {body : {text, title}, params : {entryId}} = req;
    const entry = db.collection('entries').doc(entryId);
    const currentData = (await entry.get()).data() || {}

    const entryObject = {
        id : entryId,
        title : title || currentData.title,
        text: text || currentData.text
    }

    await entry.set(entryObject)
    return res.status(200).json({
        status: 'success',
        message: 'entry updated successfully',
        data: entryObject
    })
};

export default { 
    getPosts, 
    getPost, 
    updatePost, 
    deletePost, 
    addPost
 };