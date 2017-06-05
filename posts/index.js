var fs = require('fs');
let allTags = [];
 function promiseFile(path){
	 return new Promise(function(resolve,reject){
		fs.readFile(path,'utf-8',(err,data)=>{
			if(err){
				reject();
				throw err;
			}
			let re = /---\r\n([\s\S]+)\r\n---([\s\S]+)/gm;
			let match = re.exec(data);
				if(match){
					let info = match[1];
					let [title, tags, postDate] = info.split('\r\n')
					let article = match[2];
					title = title.split(':')[1].trim();
					tags = tags.split(':')[1].trim();
					allTags.push(tags);
					resolve({
						title,
						tags,
						postDate,
						id: '/article/'+path.split('/').pop().split('.')[0],
						text:article.substr(0,200).replace(/\r|\n|#/g, ' ')
					})
				}else{
					console.log('没有标签')
				}
		})
	 })
 }
 function walk(path){
	let articleList = [];
	let promiseArr = [];
	var dirList = fs.readdirSync(path);
	dirList.forEach(function(item){
		if(fs.statSync(path + '/' + item).isDirectory()){
			walk(path);
		}else{
			if(/\.md/.test(item)){
				console.log(item)
				promiseArr.push(promiseFile(path + '/' + item))
			}
		}
	});
	Promise.all(promiseArr)
		   .then(values => {
			   allTags = allTags.join(' ').split(/\s+/)
			   fs.writeFile(__dirname+'/index.json', JSON.stringify({values,allTags}), (err) => {
			   if(err){
			   		throw (err)
				}
			   console.log('done')
			})
		}).catch(err => {
			throw(err);
		})
}
walk(__dirname);