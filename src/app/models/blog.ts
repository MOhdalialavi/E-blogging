import { comment } from "./comment"
import { likedUser } from "./likedUsers"

export class Blog {
    id:number=0
    name?:string
    author?:string
    image?:string|ArrayBuffer
    authorUname?:string
    date:Date=new Date()
    comments:comment[]=[]
    content:string=""
    likes:number = 0
    likedUsers:string[]= []
}

