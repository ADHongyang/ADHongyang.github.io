import Controller from './controller'
class Node {
	constructor (num = 0) {
		this.num = num - 0;
		this.firstSubNode = null;
		this.secondSubNode = null;
		this.parentNode = null;
		this.nodeMinNum = 1;
		this.nodeMaxNum = 1;
		this.initNodeX = 0;
		this.initNodeY = 0;
		this.id = Node.id++;
	}
}
Node.id = 0;

class RedBlackTree {
	constructor (node = new Node(0)){//初始节点是黑色的，链默认有2个节点
		this.initNode = node;
		this.preSonNode = null;
		this.nodeJustAdd = null;//当前添加的节点
		this.nodeStartJustRemove = null;//当前清除的节点的起始点
		this.nodeMap = {};
		this.preNodeMap = {};
		this.oldToNewNodeMap = {};
		// this.startTime = '';
		this.nodeWidthMap = {};
		this.Controller = new Controller();
		// 遍历红黑树，获取节点地图this.nodeMap
		this.traverseTree(this.initNode);
		// 绘制
		this.Controller.paintNodeMap(this.nodeMap);
	}
	/**遍历红黑树获取节点颜色
	 */
	getTreeNodeBackgroundColor(node, nodeMinNum){
		if(!node) return;
		let backgroundColor;
		let num = node.num;
		let initNode = this._getInitNode(this.initNode);

		if(node == initNode){//该节点是根节点
			backgroundColor = 'black';
			nodeMinNum = nodeMinNum - 1;
		}else if(this.nodeMap[node.parentNode.num].backgroundColor == 'red'){//该节点的父节点是红色的
			backgroundColor = 'black';
			nodeMinNum--;
		}else if(node.nodeMinNum > nodeMinNum){
			backgroundColor = 'red';

		}else{
			backgroundColor = 'black';
			nodeMinNum--;
		}
		
		this.nodeMap[num].backgroundColor = backgroundColor;
		this.getTreeNodeBackgroundColor(node.firstSubNode, nodeMinNum);
		this.getTreeNodeBackgroundColor(node.secondSubNode, nodeMinNum);
	}
	/**
	 * 遍历红黑树(画图用)
	 */
	traverseTree(node){
		// 获取坐标节点坐标，保存坐标
		let r = (Math.pow(2, (node.nodeMaxNum - 1)) + (node.nodeMaxNum / 2 ))  * RedBlackTree.nodeMapUnitX;
		if(node.parentNode == null){// 当前节点等于初始化节点
			node.initNodeX = 0;
			node.initNodeY = 0;
		}else{
			node.initNodeY = node.parentNode.initNodeY + RedBlackTree.nodeMapUnitY;//层级加一
			let side = this._getWhichSideFromParent(node);
			if(side == 'left'){
				if(node.secondSubNode){
					node.initNodeX = node.parentNode.initNodeX - RedBlackTree.nodeMapUnitX * 2 - this._getNodeWidth(node.secondSubNode) * RedBlackTree.nodeMapUnitX;
				}else{
					node.initNodeX = node.parentNode.initNodeX - RedBlackTree.nodeMapUnitX * 2 ;
				}
			}else {
				node.initNodeX = node.parentNode.initNodeX + r ;
				if(node.firstSubNode){
					node.initNodeX = node.parentNode.initNodeX + RedBlackTree.nodeMapUnitX * 2 + this._getNodeWidth(node.firstSubNode) * RedBlackTree.nodeMapUnitX;
				}else{
					node.initNodeX = node.parentNode.initNodeX + RedBlackTree.nodeMapUnitX * 2 ;
				}
			}
		};
		
		this.nodeMap[node.num] = {
			x: node.initNodeX,
			y: node.initNodeY,
			// r_sub: (r - RedBlackTree.nodeMapUnitX / 2) / 2 + RedBlackTree.nodeMapUnitX / 2,
			node_num: node.num
		};
		
		{
			let leftNode = node.firstSubNode;
			let rightNode = node.secondSubNode;
			let r = (node.nodeMaxNum * 2 + 1) * RedBlackTree.nodeMapUnitX;
			if(leftNode != null){

				this.nodeMap[node.num].left_node_num = leftNode.num;
				this.traverseTree(leftNode)
			}else{//直接保存null节点
				// this.nodeMap[node.num].left_radius_sub = RedBlackTree.nodeMapUnitX;
				this.nodeMap[node.num].left_node_num = null;

				this.nodeMap['null_' + node.num + '_' + 'left'] = {
					x: node.initNodeX - RedBlackTree.nodeMapUnitX,
					y: node.initNodeY + RedBlackTree.nodeMapUnitY,
					// r_sub: RedBlackTree.nodeMapUnitX,
					node_num: null
				};
			}
			if(rightNode != null){
				this.nodeMap[node.num].right_node_num = rightNode.num;
				this.traverseTree(rightNode)
			}else{
				// this.nodeMap[node.num].right_radius_sub = RedBlackTree.nodeMapUnitX;
				this.nodeMap[node.num].right_node_num = null;

				this.nodeMap['null_' + node.num + '_' + 'right'] = {
					x: node.initNodeX + RedBlackTree.nodeMapUnitX,
					y: node.initNodeY + RedBlackTree.nodeMapUnitY,
					// r_sub: RedBlackTree.nodeMapUnitX,
					node_num: null
				};
			}
		}
		
	}
	/**
	 * 获取该节点（包含所有子节点的）的总宽度
	 * @param {*} node 
	 */
	_getNodeWidth(node){
		if(!node){//当该节点为null时
			return 0;
		}else{
			if(this.nodeWidthMap[node.num]){
				return this.nodeWidthMap[node.num]
			}else{
				return this._getNodeWidth(node.firstSubNode) + this._getNodeWidth(node.secondSubNode) + 2;
			}
		}
	}
	/**
	 * 获取当前节点位于父节点的哪边
	 * @param {*} node 
	 */
	_getWhichSideFromParent(node){
		if(!node.parentNode) return '';
		if(node.parentNode.firstSubNode == node){
			return 'left'
		}else{
			return 'right'
		}
	}

	findNode(num, currentNode = this.initNode){
		if(!currentNode){//还没有这个节点
			return null;
		}
		let nextNode;
		if(num > currentNode.num){
			nextNode = currentNode.secondSubNode;
		}else if(num < currentNode.num){
			nextNode = currentNode.firstSubNode;
		}else{
			return currentNode;
		}
		return this.findNode(num, nextNode)
	}
	// 查找该num应该放置的位置的父节点, 默认红黑树中没有该节点才调用此函数。
	_findParentNode(num, currentNode = this.initNode){
		let nextNode;
		if(num > currentNode.num){
			nextNode = currentNode.secondSubNode;
			if(!nextNode){
				return {parentNode: currentNode, position: 'secondSubNode', otherPosition: 'firstSubNode'};
			}
		}else if(num < currentNode.num){
			nextNode = currentNode.firstSubNode;
			if(!nextNode){
				return {parentNode: currentNode, position: 'firstSubNode', otherPosition: 'secondSubNode'};
			}
		}
		return this._findParentNode(num, nextNode)
	}
	/**
	 * 添加节点
	 * @param {*} node 
	 * @returns 
	 */
	addNode(node){
		let num = node.num;
		if(this.findNode(num)){
			console.log('已经有这个节点了');
			return false;
		}
		// 查找添加的这个节点所应该放置的位置的父节点
		let {parentNode, position} = this._findParentNode(num);
		// 放置该节点
		parentNode[position] = node;
		node.parentNode = parentNode;
		this.nodeJustAdd = node;
		// 依次回溯父节点的nodeMinNum,nodeMaxNum
		this._changeParentNodeMinAndMaxNum(node.parentNode, 'add');

		// 清空nodeMap
		this.nodeMap = {};
		// 遍历红黑树，获取节点地图this.nodeMap
		this.traverseTree(this.initNode);
		this.getTreeNodeBackgroundColor(this.initNode, this.initNode.nodeMinNum);
		// console.log(this.nodeMap);
		
		// this.preNodeMap = this.nodeMap;
		// 绘制
		this.Controller.addTransation(this.nodeMap);

		this._resetPreSonNode();
		this._fixParentNode(node, 'add');
		return true;
	}
	/**
	 * 递归回溯父节点的nodeMinNum和nodeMaxNum, 当父节点的nodeMinNum和nodeMaxNum不改变时停止递归
	 * @param {*} node 
	 */
	_changeParentNodeMinAndMaxNum(node){
		let nodeMinNum = node.nodeMinNum;
		let nodeMaxNum = node.nodeMaxNum;
		this._setSubNodeMinAndMaxNum(node);
		if(node.parentNode){
			this._changeParentNodeMinAndMaxNum(node.parentNode);
		}
	}

	/**
	 * 重置preSonNode
	 */
	_resetPreSonNode(type){
		if(type == 'remove'){
			let {longSubNodeStr} = this._getSubNodeStr(this.nodeStartJustRemove);
			this.preSonNode = this.nodeStartJustRemove[longSubNodeStr];
		}else{
			this.preSonNode = null;
		}
	}
	/**
	 * 移除节点
	 * @param {*} num 
	 * @returns 
	 */
	removeNode(num){
		let node = this.findNode(num)
		if(!node){
			console.log('没有这个节点');
			return false;
		}
		if(node.firstSubNode == null && node.secondSubNode == null && num == this.initNode.num){
			console.log('只剩最后一个节点，不要删除')
			return false;
		}
		// 查找添加的这个节点所应该放置的位置的父节点
		// let {parentNode, position} = this._findParentNode(num);
		let parentNode = node.parentNode;
		let position;
		if(parentNode){
			if(num < parentNode.num){
				position = 'firstSubNode'
			}else{
				position = 'secondSubNode'
			}
		}
		let initNode;//回溯起点
		if(node.firstSubNode == null && node.secondSubNode == null){//末端节点,直接清除
			parentNode[position] = null;
			node = null;
			initNode = parentNode;
		}else if(node.firstSubNode == null){//左边是null
			let replaceNode = this._findNodeWhichCloseToMe(node, 'right');
			// console.log(replaceNode);
			let replaceRightSubNode = replaceNode.secondSubNode;
			let replaceParentNode = replaceNode.parentNode;
			let replaceNodeOnWhichSideFromParentNode = this._getWhichSideFromParent(replaceNode);
			// 先将repalceNode提取出来
			if(replaceRightSubNode){//如果replaceNode的右边有子节点，则顶替replaceNode
				replaceRightSubNode.parentNode = replaceParentNode;
				initNode = replaceRightSubNode;
			}else{
				if(replaceParentNode != node){
					initNode = replaceParentNode;
				}else{//node本来只剩一个右边节点的情况
					initNode = replaceNode;
				}
			}
			if(replaceNodeOnWhichSideFromParentNode == 'left'){
				replaceParentNode.firstSubNode = replaceRightSubNode;
			}else{
				replaceParentNode.secondSubNode = replaceRightSubNode;
			}
			// 再将repalceNode替换node
			replaceNode.parentNode = parentNode;
			if(parentNode){
				parentNode[position] = replaceNode;
			}
			replaceNode.firstSubNode = node.firstSubNode;
			replaceNode.secondSubNode = node.secondSubNode;
			if(node.firstSubNode){
				node.firstSubNode.parentNode = replaceNode;
			}
			if(node.secondSubNode){
				node.secondSubNode.parentNode = replaceNode;
			}

			if(node == this.initNode){//如果删除的是初始节点
				this.initNode = replaceNode;
			}
			
		}else{
			let replaceNode = this._findNodeWhichCloseToMe(node, 'left');
			// console.log(replaceNode);
			let replaceLeftSubNode = replaceNode.firstSubNode;
			let replaceParentNode = replaceNode.parentNode;
			let replaceNodeOnWhichSideFromParentNode = this._getWhichSideFromParent(replaceNode);
			// 先将repalceNode提取出来
			if(replaceLeftSubNode){//如果replaceNode的左边有子节点，则顶替replaceNode
				replaceLeftSubNode.parentNode = replaceParentNode;
				initNode = replaceLeftSubNode;
			}else{
				// initNode = replaceParentNode;
				if(replaceParentNode != node){
					initNode = replaceParentNode;
				}else{//node本来只剩一个左边节点的情况
					initNode = replaceNode;
				}
			}
			if(replaceNodeOnWhichSideFromParentNode == 'left'){
				replaceParentNode.firstSubNode = replaceLeftSubNode;
			}else{
				replaceParentNode.secondSubNode = replaceLeftSubNode;
			}
			// 再将repalceNode替换node
			replaceNode.parentNode = parentNode;
			if(parentNode){
				parentNode[position] = replaceNode;
			}
			replaceNode.firstSubNode = node.firstSubNode;
			replaceNode.secondSubNode = node.secondSubNode;
			if(node.firstSubNode){
				node.firstSubNode.parentNode = replaceNode;
			}
			if(node.secondSubNode){
				node.secondSubNode.parentNode = replaceNode;
			}

			if(node == this.initNode){//如果删除的是初始节点
				this.initNode = replaceNode;
			}
		}

		this.nodeStartJustRemove = initNode;
		// 依次回溯父节点的nodeMinNum,nodeMaxNum
		this._changeParentNodeMinAndMaxNum(this.nodeStartJustRemove);

		// 清空nodeMap
		this.nodeMap = {};
		// 遍历红黑树，获取节点地图this.nodeMap
		this.traverseTree(this.initNode);
		this.getTreeNodeBackgroundColor(this.initNode, this.initNode.nodeMinNum);
		// console.log(this.nodeMap);
		
		// 绘制
		this.Controller.addTransation(this.nodeMap);

		this._resetPreSonNode('remove');
		this._fixParentNode(this.nodeStartJustRemove, 'remove');

		return true;
	}

	/**
	 *查找离自己最近的点(左右距离，不是上下层级)
	 *
	 */
	_findNodeWhichCloseToMe(node, side){
		if(side == 'left'){
			let leftNode = node.firstSubNode;
			if(leftNode.secondSubNode == null){
				return leftNode;
			}else{
				return this._findTheFarestNode(leftNode, 'right')
			}
		}else{
			let rightNode = node.secondSubNode;
			if(rightNode.secondSubNode == null){
				return rightNode;
			}else{
				return this._findTheFarestNode(leftNode, 'left')
			}
		}
	}
	/**
	 *查找最远的子节点(左右距离，不是上下层级)
	 */
	_findTheFarestNode(node, side){
		if(side == 'left'){
			let leftNode = node.firstSubNode;
			if(leftNode == null){
				return node
			}else{
				return this._findTheFarestNode(leftNode, side)
			}
		}else{
			let rightNode = node.secondSubNode;
			if(rightNode == null){
				return node
			}else{
				return this._findTheFarestNode(rightNode, side)
			}
		}
	}

	/**
	 * 获取节点和祖父节点之间的层数
	 */
	_getNumOfLayersBetweenNodeAndParentNode(node, parentNode){
		if(node == parentNode){
			return 0;
		}
		let result = 1;
		while(node.parentNode != parentNode){
			node = node.parentNode;
			result++;
		}
		return result;
	}
	/**
	 * 修正父节点的nodeMinNum, 同时调整父节点的左右平衡
	 * @param {} node 
	 */
	_fixParentNode(node, type){
		// 重新设置该节点的nodeMinNum,nodeMaxNum属性
		this._setSubNodeMinAndMaxNum(node);
		if(type == 'add'){//添加节点的话，比较nodeMinNum和nodeNum的值
			let nodeNum = this._getNumOfLayersBetweenNodeAndParentNode(this.nodeJustAdd, node) + 1;
			if(
				nodeNum > node.nodeMinNum * 2
			){// 调整左右平衡
				// 先判断该节点的子节点this.preSonNode的左右子节点的nodeMinNum是否一样，一样的话不管
				// 再this.preSonNode的nodeMinNum长的一端 是否和该节点的相对父节点的一端 方向相同的话不管
				// 方向不同的话，调整一下this.preSonNode的左右平衡
				this._preSonNodeCheck();
				// 重新设置该节点的nodeMinNum属性
				this._setSubNodeMinAndMaxNum(node);
				if(
					this.nodeJustAdd.firstSubNode != null || 
					this.nodeJustAdd.secondSubNode != null
					){//这种情况是这个点自己变成父节点了，只出现在另一端子节点为null,增加的这端原本也只是null
					nodeNum = this._getNumOfLayersBetweenNodeAndParentNode(this.nodeJustAdd, node) + 2;
				}else {
					nodeNum = this._getNumOfLayersBetweenNodeAndParentNode(this.nodeJustAdd, node) + 1;
				}
				if(
					nodeNum > node.nodeMinNum * 2
				){// this.preSonNode节点已经调整过了，再次判断node节点是否还需要调整
					
					node = this._transPosition(node);
				}
			}
			
			this.preSonNode = node;
		}else{//去除节点的话比较 nodeMaxNum和nodeNum的值
		
			let nodeNum = this._getNumOfLayersBetweenNodeAndParentNode(this.nodeStartJustRemove, node) + 1;
			if(
				nodeNum * 2 < node.nodeMaxNum
			){// 调整左右平衡
				this._preSonNodeCheck();
				// 重新设置该节点的nodeMinNum属性
				this._setSubNodeMinAndMaxNum(node);
				if(
					nodeNum * 2 < node.nodeMaxNum
				){// this.preSonNode节点已经调整过了，再次判断node节点是否还需要调整
					
					node = this._transPosition(node, 'async');
				}
			}
			if(node.parentNode){
				let {longSubNodeStr} = this._getSubNodeStr(node.parentNode);
				this.preSonNode = node.parentNode[longSubNodeStr];
			}
		}
		
		// 回溯父节点，一直到根节点
		if(node.parentNode != null){
			this._fixParentNode(node.parentNode, type);
		}else{
			this.initNode = node;
			
		}
	}
	/**
	 * 根据节点的子节点 设置节点的nodeMinNum,nodeMaxNum
	 * 返回leftSubNodeMinNum， rightSubNodeMinNum
	 */
	_setSubNodeMinAndMaxNum(node){
		if(!node) return;

		let leftNode = node.firstSubNode, rightNode = node.secondSubNode;

		let leftSubNodeMinNum = leftNode ? (leftNode.nodeMinNum + 1) : 1;
		let rightSubNodeMinNum = rightNode ? (rightNode.nodeMinNum + 1) : 1;

		let leftSubNodeMaxNum = leftNode ? (leftNode.nodeMaxNum + 1) : 1;
		let rightSubNodeMaxNum = rightNode ? (rightNode.nodeMaxNum + 1) : 1;

		node.nodeMinNum = Math.min(leftSubNodeMinNum, rightSubNodeMinNum);
		node.nodeMaxNum = Math.max(leftSubNodeMaxNum, rightSubNodeMaxNum);
	}
	_preSonNodeCheck(){
		if(!this.preSonNode){
			return;
		}
		if(this.preSonNode.firstSubNode == null && this.preSonNode.secondSubNode == null){
			return
		}else if(
			this.preSonNode.firstSubNode && this.preSonNode.secondSubNode &&
			(this.preSonNode.firstSubNode.nodeMinNum == this.preSonNode.secondSubNode.nodeMinNum)
		){
			return
		}else{
			// 获取this.preSonNode的长节点str
			let {longSubNodeStr} = this._getSubNodeStr(this.preSonNode);
			// 获取this.preSonNode相对自己父节点的str
			let preSonNodeStr
			if(this.preSonNode.parentNode.firstSubNode == this.preSonNode){
				preSonNodeStr = 'firstSubNode'
			}else{
				preSonNodeStr = 'secondSubNode'
			}
			if(longSubNodeStr == preSonNodeStr){
				return;
			}else{
				// 调整this.preSonNode的左右平衡
				this.preSonNode = this._transPosition(this.preSonNode);
			}
		}
	}

	_getSubNodeStr(node){
		let shortSubNodeStr, longSubNodeStr;
		if(node.firstSubNode == null){
			shortSubNodeStr = 'firstSubNode'
			longSubNodeStr = 'secondSubNode'
		}else if(node.secondSubNode == null){
			shortSubNodeStr = 'secondSubNode'
			longSubNodeStr = 'firstSubNode'
		}else if(node.firstSubNode.nodeMinNum <= node.secondSubNode.nodeMinNum){
			shortSubNodeStr = 'firstSubNode'
			longSubNodeStr = 'secondSubNode'
		}else{
			shortSubNodeStr = 'secondSubNode'
			longSubNodeStr = 'firstSubNode'
		}
		return {shortSubNodeStr, longSubNodeStr}
	}

	_transPosition(node, type) {
		// 区分子节点
		let {shortSubNodeStr, longSubNodeStr} = this._getSubNodeStr(node);
		let parentNode = node.parentNode, currentNodeInParentNodePropStr;
		let longSubNode = node[longSubNodeStr];
		if(parentNode){//根节点parentNode为null时不执行这里
			if(parentNode.firstSubNode == node){
				currentNodeInParentNodePropStr = 'firstSubNode'
			}else{
				currentNodeInParentNodePropStr = 'secondSubNode'
			}
			// 先修改node父节点的内容, 父节点的子节点的指向改为当前节点node的长节点longSubNode
			parentNode[currentNodeInParentNodePropStr] = longSubNode
		}
		
		// 将node的长节点的父节点指向原node的父节点
		longSubNode.parentNode = parentNode;
		// 将节点node的父节点prop指向原长节点
		node.parentNode = longSubNode;
		// 获取长节点靠近原node节点一侧的子节点
		let givenSubNode = longSubNode[shortSubNodeStr];
		// 将长节点的原node节点一侧的子节点prop指向node
		longSubNode[shortSubNodeStr] = node;
		// 将node的长节点的prop指向givenSubNode
		node[longSubNodeStr] = givenSubNode;
		if(givenSubNode){
			givenSubNode.parentNode = node;
		}

		this._setSubNodeMinAndMaxNum(longSubNode.firstSubNode)
		this._setSubNodeMinAndMaxNum(longSubNode.secondSubNode)
		this._setSubNodeMinAndMaxNum(longSubNode)

		this.preNodeMap = this.nodeMap;
		// 清空nodeMap
		this.nodeMap = {};
		// console.log()
		// 遍历红黑树，获取节点地图this.nodeMap
		let initNode = this._getInitNode(this.initNode)
		this.traverseTree(initNode);
		if(type == 'async'){
			setTimeout(() => {
				this.getTreeNodeBackgroundColor(initNode, initNode.nodeMinNum);
				this.Controller.addTransation(this.nodeMap, this.preNodeMap)
			}, 0)
		}else{
			this.getTreeNodeBackgroundColor(initNode, initNode.nodeMinNum);
			this.Controller.addTransation(this.nodeMap, this.preNodeMap)
		}
		
		// console.log(this.initNode)

		// console.log(this.nodeMap, this.preNodeMap)
		// console.log(this._getInitNode(this.initNode));

		return longSubNode;
	}
	// 获取根节点
	_getInitNode(node){
		if(node.parentNode == null){
			return node;
		}else{
			return this._getInitNode(node.parentNode);
		}
	}

}
RedBlackTree.nodeMapUnitX = 18;//节点相对位置的单位x
RedBlackTree.nodeMapUnitY = 50;//节点相对位置的单位Y
export {Node, RedBlackTree};