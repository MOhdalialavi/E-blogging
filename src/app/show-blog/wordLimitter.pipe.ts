import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wordLimitter'
  // ,pure:false
})
export class WordLimitterPipe implements PipeTransform {
  transform(blog: string,limit: number=50): string {
    const words=blog.trim().split(/\s+/);
    const limitedContent=words.slice(0,limit).join(' ');
    // let val=blog.split(' ')
    // let newVal = val.splice(0,200).join(' ')
    // return newVal
    if (words.length>limit){
      return `${limitedContent} `;
    }
    return limitedContent
  }
}
