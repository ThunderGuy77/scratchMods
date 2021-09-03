// This project is based upon code at arpruss.github.io/gamepad.js. I will make new blocks here using it as a template. Some of the code may or may not be mine. Free to use.

class SingleGamepad {
    constructor(index) {
        this.id = null
        this.index = index
        this.currentMSecs = null
    }
    
    matches(gamepad) {
        return gamepad && this.index != null && gamepad.id == this.id && 
            gamepad.buttons.length == this.currentButtons.length && gamepad.axes.length == this.currentAxes.length
    }
    
    getGamepad(i) {
        var gamepads = navigator.getGamepads()
        if (gamepads == null || gamepads.length <= i || ! gamepads[i]) 
            return null
        return gamepads[i]
    }
    
    update(currentMSecs) {
        if (this.currentMSecs == currentMSecs)
            return
        
        var gamepad = this.getGamepad(this.index)
        
        if (gamepad == null) {
            this.id = null
            this.currentButtons = []
            this.previousButtons = []
            this.currentAxes = []
            this.previousAxes = []
            return
        }
        
        this.currentMSecs = currentMSecs
        
        if (!this.matches(gamepad)) {
            this.id = gamepad.id
        
            this.previousButtons = []
            for (var i=0;i<gamepad.buttons.length;i++) {
                this.previousButtons.push(false)
            }
            
            this.previousAxes = []
            for (var i=0;i<gamepad.axes.length;i++) {
                this.previousAxes.push(0)
            }
        }
        else {
            this.previousButtons = this.currentButtons
            this.previousAxes = this.previousAxes
        }
        
        this.currentButtons = []
        for (var i=0;i<gamepad.buttons.length;i++) {
            this.currentButtons.push(gamepad.buttons[i].pressed)
        }
        
        this.currentAxes = []
        for (var i=0;i<gamepad.axes.length;i++) {
            this.currentAxes.push(gamepad.axes[i])
        }
        console.log(this.currentButtons)
    }
    
    pressedReleased(currentMSecs,i,pr) {
        this.update(currentMSecs)
        
        if (i < this.currentButtons.length) {
            return this.currentButtons[i] != this.previousButtons[i] && this.currentButtons[i] == pr
        }
        
        return false
    }
    
    changedAxis(currentMSecs,i) {
        this.update(currentMSecs)
        
        if (i < this.currentAxes.length)
            return this.currentAxes[i] != this.previousAxes[i]
        
        return false
    }
    
    getButton(currentMSecs,i) {
        this.update(currentMSecs)
        console.log(""+currentMSecs+" "+i+this.currentButtons)
        if (i < this.currentButtons.length) {
            return this.currentButtons[i]
        }
        else {
            return false
        }
    }
    
    getAxis(currentMSecs,i) {
        this.update(currentMSecs)
        if (i < this.currentAxes.length)
            return this.currentAxes[i]
        else
            return false
    }
    
    rumble(s,w,t) {
        var gamepad = this.gamepads[i].getGamepad()
        if (gamepad != null && gamepad.vibrationActuator) {
            gamepad.vibrationActuator.playEffect("dual-rumble", {
                duration: 1000*t,
                strongMagnitude: Math.max(0,Math.min(s,1)),
                weakMagnitude: Math.max(0,Math.min(w,1))
            });
        }
    }
}

class ScratchGamepad {
    constructor(runtime) {
        this.id = null
        this.runtime = runtime
        this.gamepads = []
        for (var i=0;i<4;i++)
            this.gamepads.push(new SingleGamepad(i))
    }
    
    getInfo() {
        return {
            "id": "Utilities",
            "name": "Utlities",
            "blocks": [{
                        "opcode": "openLink",
                        "blockType": "command",
                        "text": "open link [a]",
                        "arguments": {
                            "a": {
                                "type": "string",
                                "defaultValue": "https://thunderguy77.github.io/ThunderBoltWeb/"
                            },
                        },
                    },
                        },                    
                    },
            ],
            "menus": {
                "pressReleaseMenu": [{text:"press",value:1}, {text:"release",value:0}],
                "padMenu": {
                            acceptReporters: true, 
                            items: [{text:"1",value:1}, {text:"2",value:2}, {text:"3",value:3}, {text:"4",value:4}],
                }
            }            
        };
    }
    
    buttonPressedReleased({b,pr,i}) {
        return this.gamepads[i-1].pressedReleased(this.runtime.currentMSecs,b-1,pr)
    }

    axisMoved({b,i}) {
        return this.gamepads[i-1].changedAxis(this.runtime.currentMSecs,b-1)
    }
    
    axisValue({b,i}) {
        return this.gamepads[i-1].getAxis(this.runtime.currentMSecs,b-1)
    }
    
    buttonDown({b,i}) {
        return this.gamepads[i-1].getButton(this.runtime.currentMSecs,b-1)
    }
    
    rumble({s,w,t,i}) {
        this.gamepads[i-1].rumble(s,w,t)
    }
}

(function() {
    var extensionInstance = new ScratchGamepad(window.vm.extensionManager.runtime)
    var serviceName = window.vm.extensionManager._registerInternalExtension(extensionInstance)
    window.vm.extensionManager._loadedExtensions.set(extensionInstance.getInfo().id, serviceName)
})()
