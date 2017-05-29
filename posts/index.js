var fs = require('fs');
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
					resolve({
						title,
						tags,
						postDate,
						id: '/article/'+path.split('/').pop().split('.')[0],
						text:article.substr(0,200).replace(/\r|\n|#/g, ' ')
					})
				}
		})
	 })
 }
function walk(path){
	let articleList = [];
	let promiseArr = [];
	var dirList = fs.readdirSync(path);
	console.log(dirList)
	dirList.forEach(function(item){
		if(fs.statSync(path + '/' + item).isDirectory()){
			walk(path);
		}else{
			if(/\.md/.test(item)){
				promiseArr.push(promiseFile(path + '/' + item))
			}
		}
	});
	Promise.all(promiseArr)
		   .then(values => fs.writeFile(__dirname+'/index.json', JSON.stringify(values), (err) => {
			   if(err){
			   		throw (err)
				}
			   console.log('done')
			}))
}
console.log(__dirname)
walk(__dirname);