import {Node, RedBlackTree} from '../redblacktree'
let tree = new RedBlackTree();

window.onload=function(){ 
	document.querySelector('.add').addEventListener('click', function(){
		let num = document.querySelector('#inputAdd').value;
		let node = new Node(num);
		if(tree.addNode(node)){//添加成功
			
		}else{
			alert('已经有这个数了')
		}
	})
	document.querySelector('.remove').addEventListener('click', function(){
		let num = document.querySelector('#inputAdd').value;
		tree.removeNode(num)//清除
	})
} 
	

