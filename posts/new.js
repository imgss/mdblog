const FS = require('fs');
const info = `
---
title: 
tags: 
date: ${(new Date).toLocaleString()}
---
`
let name = process.argv[2] ||`new.md`;
if(!/\.md/.test(name)){
    name = name + '.md'
}
FS.writeFile(__dirname+`/${name}`, info, err =>{
    if(err){
        console.log('error');
    }
    console.log(`${name} 已生成`)

})