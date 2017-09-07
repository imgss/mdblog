const FS = require('fs');

let name = process.argv[2] ||`new.md`;
if(!/\.md/.test(name)){
    name = name + '.md'
}

const info = `
---
title: ${name}
tags: 
date: ${(new Date).toLocaleString()}
---
`
FS.writeFile(__dirname + `/posts/${name}`, info, err =>{
    if(err){
        console.log('error');
    }
    console.log(`${name} 已生成`)

})