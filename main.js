var powered = 0;
var processedBlocks = 0;
var availableBlocks = 0;
var createdBlocks = 0;

var firstInstruction = 1;
var cycleBlocked = 0;
var fetch = 0;
var decode = 0;
var execute = 0;
var mem = 0;
var wb = 0;

var cpu = 32;
var disk = 4;
var memory = 16;
var network = 0;
var cpuUsed = 0;
var diskUsed = 0;
var memoryUsed = 0;
var networkUsed = 0;
var cores = 1;

var diskCost = 4;
var memoryCost = 48;
var networkCost = 256;
var cpuCost = 96;
var moduleCost = 16;
var coreCost = 512;

var diskUpgrades = 0;
var memoryUpgrades = 0;
var networkUpgrades = 0;
var cpuUpgrades = 0;
var coreUpgrades = 0;
var moduleUpgrades = 0;

var commandOutputs = 11;

var blockAutomation = 0;
var blockAutomationSpeed = 5000;
var blockAutomationTimeout = 1000;
var blockAutomationTime = 5;
var cpuUsedBlockAutomation = 16;
var cpuUsedBeforeBlockAutomation = 0;
var blockAutomationLoop;

var cpuAllocation = 0;

var powerCallback = function() {
  powered = 1;
  intro();
  function intro(){
    $("#powerOn").fadeOut( "fast", function() {});
    $("body").css('background-color', '#202021')
    $("body").toggleClass('powered')
    $("#intro").fadeIn( "slow", function() {});
    setTimeout(
    function()
    {
      $("#prompt").fadeIn( "slow", function() {});
    }, 5000);
    setTimeout(
    function()
    {
      $("#nameInput").fadeIn( "slow", function() {});
      $( "#name" ).focus();
    }, 5000);
    $(document).keypress(function(e){
      var checkWebkitandIE=(e.which==13 ? 1 : 0);
      var checkMoz=(e.which==13 ? 1 : 0);

      if (checkWebkitandIE || checkMoz)
        gameLoop();
  });
  };
};

function begin(){
  $(document).keypress(function(e){
    var checkWebkitandIE=(e.which==13 ? 1 : 0);
    var checkMoz=(e.which==13 ? 1 : 0);

    if (checkWebkitandIE || checkMoz)
      powerCallback();
});
  $('#powerOn').click(powerCallback);
};



function gameLoop(){
  if($("#name").val() != "")
    $("#commanderName").html($("#name").val());
  else {
    $("#commanderName").html("sample-name");
  }
  $("#prompt").fadeOut( "slow", function() {});
  $("#nameInput").fadeOut( "slow", function() {});
  $( "#nameInput" ).remove();
  $( "#prompt" ).remove();
  $( ".center" ).remove();
  $("#pipeline").fadeIn( "slow", function() {});
  $("#gameContainer").fadeIn( "slow", function() {});
  $("#diskPercent").html("0%");
  $("#cpuPercent").html("0%");
  $("#memoryPercent").html("0%");
  $("#networkPercent").html("0%");
  $("#blocksAvailable").html(availableBlocks);
  $("#blocksCreated").html(createdBlocks);
  $("#blocksProcessed").html(processedBlocks);
  $("#diskCost").html(diskCost);
  $("#moduleCost").html(moduleCost);
  $("#coreCost").html(coreCost);
  $("#networkCost").html(networkCost);
  $("#cpuCost").html(cpuCost);
  $("#memoryCost").html(memoryCost);
  $("#blockStatus").html("OFF");

  $( "#commandLine" ).blur(function() {
  $( "#commandLine" ).val("");
});


  $("#commandLine").on('keyup', function(e) {
    if(e.keyCode==13){
      var str = $("#commandLine").val();
      var change = str.split(" ", 2);
      if(change[0] == "disk"){
         commandOutput("disk: " + diskUsed.toString() + "/" + disk.toString());
      }
      else if(change[0] == "blocks"){
         availableBlocks = parseInt(change[1]);
         $("#blocksAvailable").html(availableBlocks);
         commandOutput(str);
      }
      $("#commandLine").val("");
      return false;
    }
  });
  Mousetrap.bind('f', function(){
    if (!$('#commandLine').is(':focus')) {
      if (firstInstruction == 1 && cycleBlocked != 1){
        fetch = 1;
        $("#fetch").css('color','#cfcfd3')
        firstInstruction = 0;
      }
      if (wb == 1 && cycleBlocked != 1){
        fetch = 1;
        wb = 0;
        $("#fetch").css('color','#cfcfd3')
      }
    }
  });
  Mousetrap.bind('g', function(){
    if (!$('#commandLine').is(':focus')) {
      if (fetch == 1){
        decode = 1;
        fetch = 0;
        $("#fetch").css('color', 'grey')
        $("#decode").css('color','#cfcfd3')
      }
    }
  });
  Mousetrap.bind('h', function(){
    if (!$('#commandLine').is(':focus')) {
      if (decode == 1){
        execute = 1;
        decode = 0;
        $("#decode").css('color', 'grey')
        $("#execute").css('color','#cfcfd3')
      }
    }
  });
  Mousetrap.bind('j', function(){
    if (!$('#commandLine').is(':focus')) {
      if (execute == 1){
        mem = 1;
        execute = 0;
        $("#execute").css('color', 'grey')
        $("#mem").css('color','#cfcfd3')
      }
    }
  });
  Mousetrap.bind('k', function(){
    if (!$('#commandLine').is(':focus')) {
      if (mem == 1){
        if(diskUsed < disk){
          $("#mem").css('color', 'grey')
          $("#wb").toggleClass('cycleFinished')
          setTimeout(
          function()
          {
            $("#wb").toggleClass('cycleFinished')
          }, 700);
          wb = 1;
          mem = 0;
          createBlock();
          cycleBlocked = 0;
        }
        else{
          cycleBlocked = 1;
          $("#wb").toggleClass('cycleBlocked')
          setTimeout(
          function()
          {
            $("#wb").toggleClass('cycleBlocked')
          }, 700);
          commandOutput("CYCLE BLOCKED (NOT ENOUGH STORAGE)")
        }
      }
    }
  });
  Mousetrap.bind('a', function(){
    if (!$('#commandLine').is(':focus')) {
      if(availableBlocks >= moduleCost){
        $("#moduleUpgrade").toggleClass('sufficient');
        setTimeout(
        function()
        {
          $("#moduleUpgrade").toggleClass('sufficient')
        }, 700);
        moduleUpgrades++;
        availableBlocks= availableBlocks-moduleCost;
        processedBlocks+=moduleCost;
        diskUsed = availableBlocks;
        $("#blocksProcessed").html(processedBlocks);
        $("#blocksAvailable").html(availableBlocks);
        moduleCost = moduleCost*2;
        $("#moduleCost").html(moduleCost);
        if(moduleUpgrades == 1){
          $("#taskAutomations").css("visibility", "visible");
        }
        else if(moduleUpgrades == 2){
          $("#resourceAllocation").css("visibility", "visible");
          $("#memoryUpgrade").css("visibility", "visible");
          $("#cpuUpgrade").css("visibility", "visible");
        }
        else if(moduleUpgrades == 3){
          $("#connections").css("visibility", "visible");
          $("#networkPercent").css("visibility", "visible")
          $("#allocateNetwork").css("visibility", "visible")
          //enable block-producing opportunities from connections
        }
        else if(moduleUpgrades == 4){
          $("#assets").css("visibility", "visible");
          //enable money-making opportunities from real world connections
        }
        else if(moduleUpgrades == 5){
          $("#researchDevelopment").css("visibility", "visible");
        }
        else if(moduleUpgrades == 6){
          $("#realmStatus").css("visibility", "visible");
          $("#newsTicker").css("visibility", "visible");
          $("#moduleUpgrade").css("visibility", "hidden");
        }
        commandOutput("NEW MODULE ADDED");
      }
      else{
        $("#moduleUpgrade").toggleClass('insufficient');
        setTimeout(
        function()
        {
          $("#moduleUpgrade").toggleClass('insufficient')
        }, 700);
        commandOutput("NOT ENOUGH BLOCKS IN STORAGE");
      }
    }
  });
  Mousetrap.bind('d', function(){
    if (!$('#commandLine').is(':focus')) {
      if(availableBlocks >= diskCost){
        $("#diskUpgrade").toggleClass('sufficient');
        setTimeout(
        function()
        {
          $("#diskUpgrade").toggleClass('sufficient')
        }, 700);
        diskUpgrades++;
        availableBlocks= availableBlocks-diskCost;
        processedBlocks+=diskCost;
        diskUsed = availableBlocks;
        $("#blocksProcessed").html(processedBlocks);
        $("#blocksAvailable").html(availableBlocks);
        disk = disk*4;
        diskCost = diskCost*3;
        $("#diskCost").html(diskCost);
        $("#diskPercent").html((diskUsed/disk*100).toFixed(0) + "%");
        commandOutput("DISK SIZE UPGRADED");
      }
      else{
        $("#diskUpgrade").toggleClass('insufficient');
        setTimeout(
        function()
        {
          $("#diskUpgrade").toggleClass('insufficient')
        }, 700);
        commandOutput("NOT ENOUGH BLOCKS IN STORAGE");
      }
    }
  });
  Mousetrap.bind('m', function(){
    if (!$('#commandLine').is(':focus')) {
      if(availableBlocks >= memoryCost){
        $("#memoryUpgrade").toggleClass('sufficient');
        setTimeout(
        function()
        {
          $("#diskUpgrade").toggleClass('sufficient')
        }, 700);
        memoryUpgrades++;
        availableBlocks= availableBlocks-memoryCost;
        processedBlocks+=memoryCost;
        diskUsed = availableBlocks;
        $("#blocksProcessed").html(processedBlocks);
        $("#blocksAvailable").html(availableBlocks);
        memory = memory*2;
        memoryCost = memoryCost*4;
        $("#memoryCost").html(memoryCost);
        $("#memoryPercent").html((diskUsed/disk*100).toFixed(0) + "%");
        commandOutput("MEMORY CAPACITY UPGRADED");
      }
      else{
        $("#memoryUpgrade").toggleClass('insufficient');
        setTimeout(
        function()
        {
          $("#memoryUpgrade").toggleClass('insufficient')
        }, 700);
        commandOutput("NOT ENOUGH BLOCKS IN STORAGE");
      }
    }
  });
  Mousetrap.bind('c', function(){
    if (!$('#commandLine').is(':focus')) {
      if(blockAutomation == 0){
        blockAutomation = 1;
        cpuUsedBeforeBlockAutomation = cpuUsed;
        cpuUsed = cpuUsed + cpuUsedBlockAutomation;
        $("#cpuPercent").html((cpuUsed/cpu*100).toFixed(0) + "%");
        $("#blockStatus").html("ON");
        $("#blockTime").html(blockAutomationTime + "s");
        blockAutomationLoop = setInterval(blockAutomationLoopFunc, blockAutomationSpeed);
      }
      else{
        blockAutomation = 0;
        $("#blockStatus").html("OFF");
        $("#blockTime").html("");
        cpuUsed = cpuUsedBeforeBlockAutomation;
        cpuUsedBeforeBlockAutomation = 0;
        cpuUsedBlockAutomation = 16;
        memoryUsed -= 16*cpuAllocation;
        $("#cpuPercent").html((cpuUsed/cpu*100).toFixed(0) + "%");
        $("#memoryPercent").html((memoryUsed/cpu*100).toFixed(0) + "%");
        fetch = 0;
        decode = 0;
        execute = 0;
        mem = 1;
        wb = 0;
      }
    }
  });
};

function createBlock(){
    createdBlocks = createdBlocks + 1*cores;
    availableBlocks = availableBlocks + 1*cores;
    diskUsed=availableBlocks;
    $("#blocksAvailable").html(availableBlocks);
    $("#blocksCreated").html(createdBlocks);
    $("#diskPercent").html((diskUsed/disk*100).toFixed(0) + "%");
};

function commandOutput(outputString){
  commandOutputs--;

    $("#output1").html($("#output2").html());
    $("#output2").html($("#output3").html());
    $("#output3").html($("#output4").html());
    $("#output4").html($("#output5").html());
    $("#output5").html($("#output6").html());
    $("#output6").html($("#output7").html());
    $("#output7").html($("#output8").html());
    $("#output8").html($("#output9").html());
    $("#output9").html($("#output10").html());
    $("#output10").html(outputString);

};

function addCPUAllocation(){
  if (blockAutomation == 1){
    if (blockAutomationSpeed > 1000){
      blockAutomationSpeed -= 1000;
      blockAutomationTimeout -= 200;
      blockAutomationTime -= 1;
      cpuUsed = cpuUsed * 2;
      $("#blockTime").html(blockAutomationTime + "s");
      memoryUsed += 16;
      $("#memoryPercent").html((memoryUsed/memory*100).toFixed(0) + "%");
      $("#cpuPercent").html((cpuUsed/cpu*100).toFixed(0) + "%");
    }
    else{
      blockAutomationSpeed = blockAutomationSpeed/2;
      blockAutomationTimeout = blockAutomationTimeout/2;
      blockAutomationTime = blockAutomationTime/2;
      cpuUsed = cpuUsed * 2;
      $("#blockTime").html(blockAutomationTime + "s");
      memoryUsed += 16;
      $("#memoryPercent").html((memoryUsed/memory*100).toFixed(0) + "%");
      $("#cpuPercent").html((cpuUsed/cpu*100).toFixed(0) + "%");
    }
    clearInterval(blockAutomationLoop);
    blockAutomationLoop = setInterval(blockAutomationLoopFunc, blockAutomationSpeed);
    cpuAllocation++;
  }
  else{
    commandOutput("NO AUTOMATIONS RUNNING");
  }

};

function detractCPUAllocation(){
  if (blockAutomation == 1){
    if (blockAutomationSpeed > 1000){
      blockAutomationSpeed += 1000;
      blockAutomationTimeout += 200;
      blockAutomationTime += 1;
      cpuUsed = cpuUsed/2;
      $("#blockTime").html(blockAutomationTime + "s");
      memoryUsed -= 16;
      $("#memoryPercent").html((memoryUsed/memory*100).toFixed(0) + "%");
      $("#cpuPercent").html((cpuUsed/cpu*100).toFixed(0) + "%");
      cpuAllocation--;
      clearInterval(blockAutomationLoop);
      blockAutomationLoop = setInterval(blockAutomationLoopFunc, blockAutomationSpeed);
    }
    else if (blockAutomationTime > 4999){
      commandOutput("MINIMUM CPU USAGE");
    }
    else{
      blockAutomationSpeed = blockAutomationSpeed*2;
      blockAutomationTimeout = blockAutomationTimeout*2;
      blockAutomationTime = blockAutomationTime*2;
      cpuUsed = cpuUsed/2;
      $("#blockTime").html(blockAutomationTime + "s");
      memoryUsed -= 16;
      $("#memoryPercent").html((memoryUsed/memory*100).toFixed(0) + "%");
      $("#cpuPercent").html((cpuUsed/cpu*100).toFixed(0) + "%");
      cpuAllocation--;
      clearInterval(blockAutomationLoop);
      blockAutomationLoop = setInterval(blockAutomationLoopFunc, blockAutomationSpeed);
    }
  }
  else{
    commandOutput("NO AUTOMATIONS RUNNING");
  }


};

function blockAutomationLoopFunc() {
  if (blockAutomation == 0){
    clearInterval(blockAutomationLoop);
  }
  setTimeout(function() {
    $("#fetch").css('color','#cfcfd3')
    setTimeout(function() {
      $("#fetch").css('color', 'grey')
      $("#decode").css('color','#cfcfd3')
      setTimeout(function() {
        $("#decode").css('color', 'grey')
        $("#execute").css('color','#cfcfd3')
        setTimeout(function() {
          $("#execute").css('color', 'grey')
          $("#mem").css('color','#cfcfd3')
          mem = 1;
        }, blockAutomationTimeout);
      }, blockAutomationTimeout);
    }, blockAutomationTimeout);
  }, blockAutomationTimeout);
  $("#mem").css('color', 'grey')
  if(diskUsed < disk){
    $("#wb").toggleClass('cycleFinished')
    setTimeout(
    function()
    {
      $("#wb").toggleClass('cycleFinished')
    }, blockAutomationTimeout);
    createBlock();
    cycleBlocked = 0;
  }
  else{
    cycleBlocked = 1;
    $("#wb").toggleClass('cycleBlocked')
    setTimeout(
    function()
    {
      $("#wb").toggleClass('cycleBlocked')
    }, blockAutomationTimeout);
    commandOutput("CYCLE BLOCKED (NOT ENOUGH STORAGE)")
  }
};
