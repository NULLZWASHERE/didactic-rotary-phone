/*=============================================================================*\
 * CTB Select ItemMV
 * Terms of Use:
 *  Free for commercial or non-commercial use
 *
/*=============================================================================*/
var CTB = CTB || {}; CTB.SelectItemMV  = CTB.SelectItemMV || {};
var Imported = Imported || {}; Imported["CTB_SelectItemMV"] = 1.10;
//=============================================================================//

/*~struct~HeaderWindowData:
 * @param x
 * @text X
 * @desc X Location (javascript)
 * @default this.width + 48
 *
 * @param y
 * @text Y
 * @desc Y Location (javascript)
 * @default -20
 *
 * @param width
 * @text Width
 * @desc Width (javascript)
 * @default 240
 *
 * @param height
 * @text Height
 * @desc Height (javascript)
 * @default this.fittingHeight(1) 
 *
 * @param text
 * @text Text
 * @desc Text (javascript)
 * Use quotes for direct text
 * @default "Choose an item"
 *
 */
 
/*~struct~ItemListWindowData:
 * @param x
 * @text X
 * @desc X Location (javascript)
 * @default 80
 *
 * @param y
 * @text Y
 * @desc Y Location (javascript)
 * @default 80
 *
 * @param width
 * @text Width
 * @desc Width (javascript)
 * @default Graphics.boxWidth * .4
 *
 * @param height
 * @text Height
 * @desc Height (javascript)
 * @default this.fittingHeight(this.numVisibleRows())
 *
 * @param numVisibleRows
 * @text Visible Rows
 * @desc Number of Visible Rows (javascript)
 * @default 8 
 *
 * @param maxCols
 * @text Max Columns
 * @desc Maximum Number of Columns (javascript)
 * @default 1 
 *
 * @param onOk
 * @text On OK Code
 * @desc Code for when an Item is Selected (javascript)
 * @type note
 * @default "var item = this.item();\nvar itemId = item ? item.id : 0;\n$gameVariables.setValue($gameMessage.itemChoiceVariableId(), itemId);\nthis._messageWindow.terminateMessage();\nthis.close();\nlet interpreter = CTB.SelectItemMV.determineInterpreter();\nif (item.meta.selectedItemCE){\n  interpreter._params = [eval(item.meta.selectedItemCE)];\n  interpreter.command117();\n};"
 *
 * @param onCancel
 * @text On Cancel Code
 * @desc Code for when the list is canceled (javascript)
 * @type note
 * @default "$gameVariables.setValue($gameMessage.itemChoiceVariableId(), 0);\nthis._messageWindow.terminateMessage();\nthis.close();"
 *
 */

/*~struct~SelectItemWindowData:
 * @param x
 * @text X
 * @desc X Location (javascript)
 * @default 
 *
 * @param y
 * @text Y
 * @desc Y Location (javascript)
 * @default 
 *
 * @param width
 * @text Width
 * @desc Width (javascript)
 * @default 
 *
 * @param height
 * @text Height
 * @desc Height (javascript)
 * @default 
 *
 * @param imageDir
 * @text Image Directory
 * @desc Path to the Images (javascript)
 * Default: "img/pictures/"
 * @default "img/pictures/" 
 *
 * @param imageScale
 * @text Image Scale
 * @desc Default Scale of the Images (javascript)
 * Default: 1
 * @default 1
 *
 */

/*:
 * @target MV
 * @plugindesc [RPG Maker MV] [Tier 1] [Version 1.10] [CT_Bolt - Select Item]
 * @author CT_Bolt
 *
 * @param ItemListWindowProperties
 * @text Item List Window Properties
 * @type struct<ItemListWindowData>
 * @desc Size, Location, Etc. of Item List Window
 * @default {"x":"80","y":"80","width":"Graphics.boxWidth * .4","height":"this.fittingHeight(this.numVisibleRows())","numVisibleRows":"8","maxCols":"1","onOk":"\"var item = this.item();\\nvar itemId = item ? item.id : 0;\\n$gameVariables.setValue($gameMessage.itemChoiceVariableId(), itemId);\\nthis._messageWindow.terminateMessage();\\nthis.close();\\nlet interpreter = CTB.SelectItemMV.determineInterpreter();\\nif (item.meta.selectedItemCE){\\n  interpreter._params = [eval(item.meta.selectedItemCE)];\\n  interpreter.command117();\\n};\"","onCancel":"\"$gameVariables.setValue($gameMessage.itemChoiceVariableId(), 0);\\nthis._messageWindow.terminateMessage();\\nthis.close();\""}
 *
 * @param SelectedItemWindowProperties
 * @text Selected Item Window Properties
 * @type struct<SelectItemWindowData>
 * @desc Size & Location of Item Selected Window
 * @default {"x":"this.width + 72","y":"(this.height - this._selectedWindow.height) / 2","width":"192","height":"192","imageDir":"\"img/pictures/\""}
 *
 * @param HeaderWindowProperties
 * @text Header Window Properties
 * @type struct<HeaderWindowData>
 * @desc Size, Location & Text of Header Window
 * @default {"x":"this.width + 48","y":"-20","width":"240","height":"this.fittingHeight(1)","text":"\"Choose an item\""} 
 *
 * @param pauseCharacterMovement
 * @text Pause Character Movement
 * @desc Pause Just Character Movement? (javascript)
 * Default: false
 * @default false
 *
 * @param pauseAllEvents
 * @text Pause All Events
 * @desc Pause All Events Completely? (javascript)
 * Default: false
 * @default false
 *
 * @help
 * To use:
 * Simple & Efficient way:
 * Use this script call:
 *  CTB.SelectItem(varId, *itemType*, *standardMV*)
 * varId: Variable Id to store the item number picked
 * itemType: 1 (Normal), 2 (Key), 3 (Hidden A), or 4 (Hidden B)
 * standardMV: Set to true to use the standardMV item select window
 * Both itemType & standardMV are optional
 * 
 * Examples:
 *  CTB.SelectItem(1, 4)
 *  CTB.SelectItem(5)
 *  CTB.SelectItem(7, 2)
 *
 * ...or..
 *
 * Use the following script call:
 * CTB.SelectItemMV.enabled = true;
 * Then call the Select Item command from the event list
 * Upon completion CTB.SelectItemMV.enabled will auto revert to false
 * Optionally you may also use the script call CTB.SelectItemMV.keepEnabled to not auto revert
 * With that then you would manually set CTB.SelectItemMV.enabled back to false to use the default Item Select window 
 *
 *
 * Setup parameters as desired
 * Place notetags in the item notes
 * Notetags are as follows:
 *  <selectedItemImage:'image filename'>
 *  <selectedItemHue:*hue ranges from 0 to 360*>
 *  <selectedItemScale:*image scale*>
 *  <selectedItemCE:*common event ID*>
 *
 * Example notetags:
 *  <selectedItemImage:'image filename'>
 *  <selectedItemHue:128>
 *  <selectedItemScale:2>
 *  <selectedItemCE:1>
 *
 * All notetags are evaluated javascript
 * 
 * Place image files in the chosen directory set in the parameters
 * Default directory is "img/pictures/"
 *
 */
//=============================================================================
//=============================================================================

(function ($_$) {
	$_$.data = $_$.data || [];
	$_$.data.push({params:getPluginParameters()});
	var index_SelectItem = $_$.data.length-1;
	
	function getPluginParameters() {var a = document.currentScript || (function() {var b = document.getElementsByTagName('script'); return b[b.length - 1]; })(); var id = $_$.data.length > 0 ? ' ' + $_$.data.length : ''; return PluginManager.parameters(a.src.substring((a.src.lastIndexOf('/') + 1), a.src.indexOf('.js'))+id);};
	
	if (index_SelectItem > 0 || !Imported["CT_Bolt PluginManagerEx"]){
		// Create Javascript Object(s) from Parameter Structure(s)
		const parsedParams = ['ItemListWindowProperties','SelectedItemWindowProperties','HeaderWindowProperties'];
		parsedParams.forEach(function(v){
			$_$.data[index_SelectItem].params[v] = $_$.data[index_SelectItem].params[v] || '""';
			$_$.data[index_SelectItem].params[v] = JSON.parse($_$.data[index_SelectItem].params[v]);
		});	
	};

	$_$.data[index_SelectItem].params.ItemListWindowProperties.onOk = $_$.data[index_SelectItem].params.ItemListWindowProperties.onOk || '""';
	$_$.data[index_SelectItem].params.ItemListWindowProperties.onOk = JSON.parse($_$.data[index_SelectItem].params.ItemListWindowProperties.onOk);
	$_$.data[index_SelectItem].params.ItemListWindowProperties.onCancel = $_$.data[index_SelectItem].params.ItemListWindowProperties.onCancel || '""';
	$_$.data[index_SelectItem].params.ItemListWindowProperties.onCancel = JSON.parse($_$.data[index_SelectItem].params.ItemListWindowProperties.onCancel);
	
	//-----------------------------------------------------------------------------
	// Sprite_SelectedItem
	//
	// The sprite for displaying the selected item.

	function Sprite_SelectedItem() {
		this.initialize.apply(this, arguments);
	}

	Sprite_SelectedItem.prototype = Object.create(Sprite.prototype);
	Sprite_SelectedItem.prototype.constructor = Sprite_SelectedItem;

	Sprite_SelectedItem.prototype.initialize = function() {
		Sprite.prototype.initialize.call(this);
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;
	};
	
	$_$['Sprite_SelectedItem.prototype._onBitmapLoad'] = Sprite_SelectedItem.prototype._onBitmapLoad;
	Sprite_SelectedItem.prototype._onBitmapLoad = function(bitmapLoaded) {
		$_$['Sprite_SelectedItem.prototype._onBitmapLoad'].apply(this, arguments);
		if(bitmapLoaded === this._bitmap){
			// Optional spot to place code for when the bitmap is loaded
		};
	};

	//-----------------------------------------------------------------------------
	// Window_SelectedItem
	//
	// The window for displaying the selected item.
	
	function Window_SelectedItem() {
		this.initialize.apply(this, arguments);
	}

	Window_SelectedItem.prototype = Object.create(Window_Base.prototype);
	Window_SelectedItem.prototype.constructor = Window_SelectedItem;

	Window_SelectedItem.prototype.initialize = function(mainWindow, x, y) {
		this._mainWindow = mainWindow;
		var width = this.windowWidth();
		var height = this.windowHeight();
		Window_Base.prototype.initialize.call(this, x, y, width, height);
		this._sprite = new Sprite_SelectedItem();
		this._sprite.x = this.windowWidth() / 2;
		this._sprite.y = this.windowHeight() / 2;		
		this.addChild(this._sprite);
		this.refresh();
	};

	Window_SelectedItem.prototype.windowWidth = function() {
		return eval($_$.data[index_SelectItem].params.SelectedItemWindowProperties.width) || 192;
	};

	Window_SelectedItem.prototype.windowHeight = function() {
		return eval($_$.data[index_SelectItem].params.SelectedItemWindowProperties.height) || 192;
	};

	Window_SelectedItem.prototype.refresh = function() {
		if (this._mainWindow._index > -1){
			let dir = eval($_$.data[index_SelectItem].params.SelectedItemWindowProperties.imageDir) || 'img/pictures/';
			let hue = 0, scale = eval($_$.data[index_SelectItem].params.SelectedItemWindowProperties.imageScale) || 1;
			if (this._mainWindow.item().meta.selectedItemHue){hue = eval(this._mainWindow.item().meta.selectedItemHue);}
			if (this._mainWindow.item().meta.selectedItemScale){scale = eval(this._mainWindow.item().meta.selectedItemScale);}
			this._sprite.bitmap = ImageManager.loadBitmap(dir, eval(this._mainWindow.item().meta.selectedItemImage), hue, true);
			this._sprite.scale.x = scale;
			this._sprite.scale.y = scale;
		};
	};

	Window_SelectedItem.prototype.open = function() {
		this.refresh();
		Window_Base.prototype.open.call(this);
	};
	
	Window_SelectedItem.prototype.drawBackground = function(x, y, width, height) {
		var color1 = this.dimColor1();
		var color2 = this.dimColor2();
		this.contents.gradientFillRect(x, y, width / 2, height, color2, color1);
		this.contents.gradientFillRect(x + width / 2, y, width / 2, height, color1, color2);
	};
		
	//-----------------------------------------------------------------------------
	// Window_EventItem_Header
	//
	// The window for displaying the select an item header

	function Window_EventItem_Header() {
		this.initialize.apply(this, arguments);
	}

	Window_EventItem_Header.prototype = Object.create(Window_Base.prototype);
	Window_EventItem_Header.prototype.constructor = Window_EventItem_Header;

	Window_EventItem_Header.prototype.initialize = function(x, y) {
		var width = this.windowWidth();
		var height = this.windowHeight();
		Window_Base.prototype.initialize.call(this, x, y, width, height);
		this.refresh();
	};

	Window_EventItem_Header.prototype.windowWidth = function() {
		return eval($_$.data[index_SelectItem].params.HeaderWindowProperties.width) || 240;
	};

	Window_EventItem_Header.prototype.windowHeight = function() {
		return eval($_$.data[index_SelectItem].params.HeaderWindowProperties.height) || this.fittingHeight(1);
	};

	Window_EventItem_Header.prototype.refresh = function() {
		var x = this.textPadding();
		var width = this.contents.width - this.textPadding() * 2;
		this.contents.clear();
		let text = eval($_$.data[index_SelectItem].params.HeaderWindowProperties.text) || 'Choose an item';
		this.drawText(text, x, 0, width, 'center');
	};
	
	Window_EventItem_Header.prototype.open = function() {
		this.refresh();
		Window_Base.prototype.open.call(this);
	};
	
	//-----------------------------------------------------------------------------
	// Window_EventItem_CTB
	//
	// The window used for the event command [Select Item].

	function Window_EventItem_CTB() {
		this.initialize.apply(this, arguments);
	}

	Window_EventItem_CTB.prototype = Object.create(Window_EventItem.prototype);
	Window_EventItem_CTB.prototype.constructor = Window_EventItem_CTB;

	Window_EventItem_CTB.prototype.initialize = function(messageWindow) {
		this._messageWindow = messageWindow;
		var width = eval($_$.data[index_SelectItem].params.ItemListWindowProperties.width) || Graphics.boxWidth * .4;
		var height = this.windowHeight();
		Window_ItemList.prototype.initialize.call(this, 0, 0, width, height);
		this.openness = 0;
		this.createSubWindows();
		this.deactivate();
		this.setHandler('ok',     this.onOk.bind(this));
		this.setHandler('cancel', this.onCancel.bind(this));
	};
	
	Window_EventItem_CTB.prototype.select = function(index) {
		Window_Selectable.prototype.select.call(this, index);
		if (this._selectedWindow) {this._selectedWindow.refresh();};
	};
	
	Window_EventItem_CTB.prototype.subWindows = function() {
		return [this._headerWindow, this._selectedWindow];
	};
	
	Window_EventItem_CTB.prototype.createSubWindows = function() {
		this._headerWindow = new Window_EventItem_Header(0, 0);		
		this._headerWindow.x = eval($_$.data[index_SelectItem].params.HeaderWindowProperties.x) || (this.width + 48);
		this._headerWindow.y = eval($_$.data[index_SelectItem].params.HeaderWindowProperties.y) || -20;		
		this._headerWindow.openness = 255;
		
		this._selectedWindow = new Window_SelectedItem(this);		
		this._selectedWindow.x = eval($_$.data[index_SelectItem].params.SelectedItemWindowProperties.x) || (this.width + 72)
		this._selectedWindow.y = eval($_$.data[index_SelectItem].params.SelectedItemWindowProperties.y) || ((this.height - this._selectedWindow.height) / 2);		
		this._selectedWindow.openness = 255;
		
		this.addChild(this._headerWindow);
		this.addChild(this._selectedWindow);
	};

	Window_EventItem_CTB.prototype.windowHeight = function() {
		return eval($_$.data[index_SelectItem].params.ItemListWindowProperties.height) || this.fittingHeight(this.numVisibleRows());
	};

	Window_EventItem_CTB.prototype.numVisibleRows = function() {
		return eval($_$.data[index_SelectItem].params.ItemListWindowProperties.numVisibleRows) || 8;
	};

	Window_EventItem_CTB.prototype.maxCols = function() {
		return eval($_$.data[index_SelectItem].params.ItemListWindowProperties.maxCols) || 1;
	};

	Window_EventItem_CTB.prototype.start = function() {
		this.refresh();
		this.updatePlacement();
		this.select(0);
		this.open();
		this.activate();
		if (eval($_$.data[index_SelectItem].params.pauseCharacterMovement)){
			CTB.SelectItemMV.pausedCharacterMovement = true;
		};
		if (eval($_$.data[index_SelectItem].params.pauseAllEvents)){
			CTB.SelectItemMV.pausedAllEvents = true;
		};
	};

	Window_EventItem_CTB.prototype.updatePlacement = function() {
		this.x = eval($_$.data[index_SelectItem].params.ItemListWindowProperties.x) || 0;
		this.y = eval($_$.data[index_SelectItem].params.ItemListWindowProperties.y) || 0;
	};

	Window_EventItem_CTB.prototype.needsNumber = function() {
		return false;
	};

	$_$['Window_EventItem_CTB.prototype.onOk'] = Window_EventItem_CTB.prototype.onOk;
	Window_EventItem_CTB.prototype.onOk = function() {
		if ($_$.data[index_SelectItem].params.ItemListWindowProperties.onOk !== ''){
			eval($_$.data[index_SelectItem].params.ItemListWindowProperties.onOk);
		}else{
			$_$['Window_EventItem_CTB.prototype.onOk'].apply(this, arguments);
		};
	};

	$_$['Window_EventItem_CTB.prototype.onCancel'] = Window_EventItem_CTB.prototype.onCancel;
	Window_EventItem_CTB.prototype.onCancel = function() {
		if ($_$.data[index_SelectItem].params.ItemListWindowProperties.onCancel !== ''){
			eval($_$.data[index_SelectItem].params.ItemListWindowProperties.onOk);
		}else{
			$_$['Window_EventItem_CTB.prototype.onCancel'].apply(this, arguments);
		};
	};
	
	$_$['Window_EventItem_CTB.prototype.close'] = Window_EventItem_CTB.prototype.close;
	Window_EventItem_CTB.prototype.close = function() {
		$_$['Window_EventItem_CTB.prototype.close'].apply(this, arguments);
		if (eval($_$.data[index_SelectItem].params.pauseCharacterMovement)){
			CTB.SelectItemMV.pausedCharacterMovement = false;
		};
		if (eval($_$.data[index_SelectItem].params.pauseAllEvents)){
			CTB.SelectItemMV.pausedAllEvents = false;
		};
		if (CTB.SelectItemMV.calledFromScript){
			CTB.SelectItemMV.calledFromScript = false;
			if (!eval(CTB.SelectItemMV.keepEnabled)){
				CTB.SelectItemMV.enabled = false;
			};
		};
	};
	
	//-----------------------------------------------------------------------------
	// Window_Message
	//
	
	// Alias
	$_$['Window_Message.prototype.subWindows'] = Window_Message.prototype.subWindows;
	Window_Message.prototype.subWindows = function() {
		let r = $_$['Window_Message.prototype.subWindows'].apply(this, arguments);
		r.push(this._itemWindow_ctb);
		return r;
	};
	
	// Alias
	$_$['Window_Message.prototype.createSubWindows'] = Window_Message.prototype.createSubWindows;	
	Window_Message.prototype.createSubWindows = function() {
		$_$['Window_Message.prototype.createSubWindows'].apply(this, arguments);
		this._itemWindow_ctb = new Window_EventItem_CTB(this);
	};
	
	// Alias
	$_$['Window_Message.prototype.isAnySubWindowActive'] = Window_Message.prototype.isAnySubWindowActive;
	Window_Message.prototype.isAnySubWindowActive = function() {
		let r = $_$['Window_Message.prototype.isAnySubWindowActive'].apply(this, arguments);		
		return r || this._itemWindow_ctb.active;
	};

	// Alias
	$_$['Window_Message.prototype.startInput'] = Window_Message.prototype.startInput;
	Window_Message.prototype.startInput = function() {
		let r = false;
		if (CTB.SelectItemMV.enabled && $gameMessage.isItemChoice()){
			this._itemWindow_ctb.start();
			r = true;
		}else{
			r = $_$['Window_Message.prototype.startInput'].apply(this, arguments);
		};
		return r;
	};
	
	//-----------------------------------------------------------------------------
	// Game_CharacterBase
	//
	
	// Alias
	$_$['Game_CharacterBase.prototype.update'] = Game_CharacterBase.prototype.update;
	Game_CharacterBase.prototype.update = function() {
		if (!CTB.SelectItemMV.pausedCharacterMovement){
			$_$['Game_CharacterBase.prototype.update'].apply(this, arguments);
		};
	};
	
	//-----------------------------------------------------------------------------
	// Game_Event
	//
	
	// Alias
	$_$['Game_Event.prototype.update'] = Game_Event.prototype.update;
	Game_Event.prototype.update = function() {
		if (!CTB.SelectItemMV.pausedAllEvents){
			$_$['Game_Event.prototype.update'].apply(this, arguments);
		};
	};
	
})(CTB.SelectItemMV, this);

CTB.SelectItemMV.determineInterpreter = function(){
	return $gameParty.inBattle() ? $gameTroop._interpreter : $gameMap._interpreter;
};

CTB.SelectItem = function (varId, itemType, standardMV){
	if (varId > 0){
		if (!standardMV){
			CTB.SelectItemMV.enabled = true;
			CTB.SelectItemMV.calledFromScript = true;
		};
		itemType = itemType || 1;
		$gameMessage.setItemChoice(varId, 4);
		let interpreter = CTB.SelectItemMV.determineInterpreter();
		interpreter.setWaitMode('message');
	};
};

//CTB.SelectItemMV.enabled = true;