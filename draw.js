import {Node, RedBlackTree} from './redblacktree'
class Draw{
	constructor(){
		var c=document.getElementById("myCanvas");
		this.ctx=c.getContext("2d");	
		this.unit = 10;
		this.startX = 500;
		this.startY = 20;
	}
	_isTrue(num){
		if(num == undefined || num == null){
			return false
		}
		return true;
	}
	// 绘制红黑树(用于红黑树的正常绘制)
	paint(nodeMap){
		// 先清除原先的画
		this.ctx.clearRect(0, 0, 1000, 800);
		// console.log(nodeMap)
		// 再画
		for(let num in nodeMap){
			let {x, y, node_num, left_node_num, right_node_num, backgroundColor} = nodeMap[num];
			let leftNode = left_node_num;
			let rightNode = right_node_num;
			x = x + this.startX;
			y = y + this.startY;
			// console.log(num, node_num)
			if(this._isTrue(node_num)){
				// 绘制节点
				this.drawNode(x, y, num, backgroundColor);
				// 绘制连线
				let firstX = x;
				let firstY = y + 1.5 * this.unit;
				
				let leftNodeSecondX, leftNodeSecondY, rightNodeSecondX, rightNodeSecondY;
				// console.log(this._isTrue(leftNode), leftNode)
				if(this._isTrue(leftNode)){
					let leftNum = leftNode;
					// console.log(leftNode, leftNum, nodeMap, nodeMap[leftNum])
					leftNodeSecondX = nodeMap[leftNum].x + this.startX;
					leftNodeSecondY = nodeMap[leftNum].y - 1.5 * this.unit + this.startY;
					// console.log(leftNodeSecondX, leftNodeSecondY)
				}else{//左子节点是null
					leftNodeSecondX = x - RedBlackTree.nodeMapUnitX;
					leftNodeSecondY = y + RedBlackTree.nodeMapUnitY - 1.5 * this.unit;
				}
				if(this._isTrue(rightNode)){
					let rightNum = rightNode;
					
					rightNodeSecondX = nodeMap[rightNum].x + this.startX;
					rightNodeSecondY = nodeMap[rightNum].y - 1.5 * this.unit + this.startY;
				}else{//右子节点是null
					rightNodeSecondX = x + RedBlackTree.nodeMapUnitX;
					rightNodeSecondY = y + RedBlackTree.nodeMapUnitY - 1.5 * this.unit;
				}
				// let rightNodeSecondX = x + right_radius_sub;
				// let rightNodeSecondY = y + RedBlackTree.nodeMapUnitY - 1.5 * this.unit;
				this.line(firstX, firstY, leftNodeSecondX, leftNodeSecondY);
				this.line(firstX, firstY, rightNodeSecondX, rightNodeSecondY);
			}else{
				this.drawNullNode(x, y);
			}
		}
	}
	// 绘制红黑树，(用于绘制红黑树的连接线的变换过程)
	// nodeMap表示未转化的map, nextNodeMap表示转化后的map, perS表示当前执行时间的百分比
	paintForLineTrans(nodeMap, nextNodeMap, perS){
		// console.log(perS)
		// 先清除原先的画
		this.ctx.clearRect(0, 0, 1000, 800);
		
		// console.log(nodeMap, nextNodeMap)
		// 再画
		for(let num in nodeMap){
			let {x, y, node_num, left_node_num, right_node_num, backgroundColor} = nodeMap[num];	
			let leftNode = left_node_num;
			let rightNode = right_node_num;

			let node2 = nextNodeMap[num];
			let nextLeftNodeNum = node2 && node2.left_node_num;
			let nextRightNodeNum = node2 && node2.right_node_num;

			// let nextLeftNode = nextLeftNodeNum && nodeMap[nextLeftNodeNum].node;
			// let nextRightNode = node2 && nextRightNodeNum && nodeMap[nextRightNodeNum] && nodeMap[nextRightNodeNum].node;

			x = x + this.startX;
			y = y + this.startY;
			if(this._isTrue(node_num)){
				// 绘制节点
				this.drawNode(x, y, num, backgroundColor);

				// 绘制连线
				let firstX = x;
				let firstY = y + 1.5 * this.unit;
				
				let leftNodeSecondX, leftNodeSecondY, rightNodeSecondX, rightNodeSecondY;
				// console.log('num', num, leftNode)
				if(this._isTrue(leftNode)){
					let leftNum = leftNode;
					leftNodeSecondX = nodeMap[leftNum].x + this.startX;
					leftNodeSecondY = nodeMap[leftNum].y - 1.5 * this.unit + this.startY;
					// console.log(leftNodeSecondX, leftNodeSecondY)
				}else{//左子节点是null
					leftNodeSecondX = x - RedBlackTree.nodeMapUnitX;
					leftNodeSecondY = y + RedBlackTree.nodeMapUnitY - 1.5 * this.unit;
				}
				if(this._isTrue(rightNode)){
					let rightNum = rightNode;
					
					rightNodeSecondX = nodeMap[rightNum].x + this.startX;
					rightNodeSecondY = nodeMap[rightNum].y - 1.5 * this.unit + this.startY;
				}else{//右子节点是null
					rightNodeSecondX = x + RedBlackTree.nodeMapUnitX;
					rightNodeSecondY = y + RedBlackTree.nodeMapUnitY - 1.5 * this.unit;
				}

				let nextLeftNodeSecondX, nextLeftNodeSecondY, nextRightNodeSecondX, nextRightNodeSecondY;
				if(this._isTrue(nextLeftNodeNum)){
					let leftNum = nextLeftNodeNum;
					nextLeftNodeSecondX = nodeMap[leftNum].x + this.startX;
					nextLeftNodeSecondY = nodeMap[leftNum].y - 1.5 * this.unit + this.startY;
				}else{//左子节点是null
					nextLeftNodeSecondX = x - RedBlackTree.nodeMapUnitX;
					nextLeftNodeSecondY = y + RedBlackTree.nodeMapUnitY - 1.5 * this.unit;
				}
				if(this._isTrue(nextRightNodeNum)){
					let rightNum = nextRightNodeNum;
					
					nextRightNodeSecondX = nodeMap[rightNum].x + this.startX;
					nextRightNodeSecondY = nodeMap[rightNum].y - 1.5 * this.unit + this.startY;
				}else{//右子节点是null
					nextRightNodeSecondX = x + RedBlackTree.nodeMapUnitX;
					nextRightNodeSecondY = y + RedBlackTree.nodeMapUnitY - 1.5 * this.unit;
				}

				// let rightNodeSecondX = x + right_radius_sub;
				// let rightNodeSecondY = y + RedBlackTree.nodeMapUnitY - 1.5 * this.unit;
				// console.log(leftNodeSecondX, nextLeftNodeSecondX)
				this.line(firstX, firstY, 
					(nextLeftNodeSecondX - leftNodeSecondX) * perS + leftNodeSecondX, 
					(nextLeftNodeSecondY - leftNodeSecondY) * perS + leftNodeSecondY
					);

				this.line(firstX, firstY, 
					(nextRightNodeSecondX - rightNodeSecondX) * perS + rightNodeSecondX, 
					(nextRightNodeSecondY - rightNodeSecondY) * perS + rightNodeSecondY
					);
			}else{
				this.drawNullNode(x, y);
			}
		}
	}

	// 圆形
	circle(x, y, r, backgroundColor){
		// this.ctx.strokeStyle ="red";
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, 2*Math.PI);
		// this.ctx.stroke();
		this.ctx.fillStyle = backgroundColor;

		this.ctx.fill();
	}
	// 写字
	text(x, y, size, str){
		this.ctx.font= size + 'px sans-serif';
		let y1 = y + size / 2.5;
		let x1 = x - (size * str.length / 3.4);
		this.ctx.fillStyle="white";
		this.ctx.fillText(str, x1, y1);
		// this.ctx.stroke();
	}
	// 方形
	square(x, y, w, h){
		let x1 = x - w / 2;
		let y1 = y - h / 2;
		this.ctx.fillStyle="black";
		this.ctx.fillRect(x1, y1, w, h);
	}
	// 线条
	line(x1, y1, x2, y2){
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.strokeStyle ="black";
		this.ctx.stroke();
	}
	// 绘制节点
	drawNode(x, y, num, backgroundColor='black'){
		// 圆的半径
		let r = 1.5 * this.unit;
		// let random = Math.random() - 0.5;
		// let backgroundColor;
		// backgroundColor = random > 0 ? 'red' : 'black'
		this.circle(x, y, r, backgroundColor);
		// 字体大小设置成unit
		var num = num + '';
		let fontSize = this.unit * 1.2;
		this.text(x, y, fontSize, num)
	}
	drawNullNode(x, y){
		// return 
		// 方形
		let w = this.unit * 2;
		let h = this.unit * 3;
		this.square(x, y, w, h);

		// 写字
		let fontSize = this.unit * 1.8;
		this.text(x, y, fontSize, 'n')
	}
}

export default Draw;