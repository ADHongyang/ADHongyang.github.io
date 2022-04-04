import Draw from './draw'
export default class Controller{
	constructor(nodeMap){
		this.draw = new Draw();
		this.paintNodeMap(nodeMap);
		this.startTime = '';
		this.nodeMap = null;
		this.preNodeMap = null;
		this.transTime = 1000;//变换时间1s
		this.transation = [];//动画事务
		this.isAni = false;//是否正在执行动画
	}
	addTransation(nodeMap, preNodeMap){
		// var nodeMap = JSON.parse(JSON.stringify(nodeMap))
		// var preNodeMap = JSON.parse(JSON.stringify(preNodeMap))
		if(preNodeMap){
			this.transation.push({nodeMap, preNodeMap});
		}else{
			this.transation.push({nodeMap});
		}
		this.runTransation();
	}
	sleep(times){
		return new Promise(resolve => {
			setTimeout(() => {
				resolve()
			}, times)
		})
	}
	async runTransation(){
		if(!this.isAni && this.transation.length){
			this.isAni = true;
			let {nodeMap, preNodeMap} = this.transation.splice(0, 1)[0];
			if(preNodeMap){
				await this.sleep(500)
				// console.log(1)
				this.getTheLineChange(nodeMap, preNodeMap);
	
				await this.sleep(1600)
				// console.log(2)
				this.getTheChange(nodeMap, preNodeMap);
	
				await this.sleep(1600)
			}else{
				this.paintNodeMap(nodeMap);
			}
			
			// console.log(3)
			this.isAni = false;
			this.runTransation();
		}
	}
	paintNodeMap(nodeMap){
		this.draw.paint(nodeMap);
	}
	paintLineTrans(perS){
		this.draw.paintForLineTrans(this.preNodeMap, this.nodeMap, perS);
	}
	getTheLineChange(nodeMap, preNodeMap){
		this.nodeMap = nodeMap;
		this.preNodeMap = preNodeMap;
		requestAnimationFrame(this._stepLineAni.bind(this))
	}
	_stepLineAni(timestamp){
		if(!this.startTime) this.startTime = timestamp;

		// 绘制

		this.paintLineTrans((timestamp - this.startTime) / this.transTime);
		// console.log(newNodeMap);
		// 停止动画~~
		if(timestamp - this.startTime > this.transTime){
			// 绘制最终版本
			this.paintLineTrans(1);
			this.startTime = '';
			// console.log(this.nodeMap)
			return
		}

		requestAnimationFrame(this._stepLineAni.bind(this))
	}

	// 遍历preNodeMap，保存变化数据，执行变换动画
	getTheChange(nodeMap, preNodeMap){
		// console.log(nodeMap, preNodeMap)
		this.nodeMap = nodeMap;
		this.preNodeMap = preNodeMap;
		this.oldToNewNodeMap = {};
		for(let nodeKey in this.nodeMap){
			let newNode = this.nodeMap[nodeKey];
			let oldNode = this.preNodeMap[nodeKey];
			if(newNode && oldNode){
				this.oldToNewNodeMap[nodeKey] = {
					x_gap: oldNode.x - newNode.x,
					y_gap: oldNode.y - newNode.y,
					backgroundColor: oldNode.backgroundColor,
				}
			}
			
		}
		// console.log(this.nodeMap);
		// console.log(this.preNodeMap);
		// console.log(this.oldToNewNodeMap);
		requestAnimationFrame(this._stepAni.bind(this))
	}
	// 变换动画
	_stepAni(timestamp){
		if(!this.startTime) this.startTime = timestamp;

		// 获取这个时候的nodeMap
		let newNodeMap = {};
		for(let nodeKey in this.oldToNewNodeMap){
			// let newNode = JSON.parse(JSON.stringify(this.nodeMap[nodeKey]));
			let newNode = {
				x: this.nodeMap[nodeKey].x,
				y: this.nodeMap[nodeKey].y,
				node_num: this.nodeMap[nodeKey].node_num,
				left_node_num: this.nodeMap[nodeKey].left_node_num,
				right_node_num: this.nodeMap[nodeKey].right_node_num,
			};
			newNodeMap[nodeKey] = newNode;
			newNodeMap[nodeKey].x += (1 - (timestamp-this.startTime)/this.transTime) * this.oldToNewNodeMap[nodeKey].x_gap;
			newNodeMap[nodeKey].y += (1 - (timestamp-this.startTime)/this.transTime) * this.oldToNewNodeMap[nodeKey].y_gap;
			newNodeMap[nodeKey].backgroundColor = this.nodeMap[nodeKey].backgroundColor;
		}
		// 绘制
		this.paintNodeMap(newNodeMap);
		// console.log(newNodeMap);
		// 停止动画~~
		if(timestamp - this.startTime > this.transTime){
			// 绘制最终版本
			this.paintNodeMap(this.nodeMap);
			this.startTime = '';
			// console.log(this.nodeMap)
			return
		}

		requestAnimationFrame(this._stepAni.bind(this))
	}
}