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

var cpu = 100;
var disk = 4;
var memory = 1;
var network = 0;
var cpuUsed = 0;
var diskUsed = 0;
var memoryUsed = 0;
var networkUsed = 0;
var cores = 1;

var diskCost = 4;
var memoryCost = 64;
var networkCost = 256;
var cpuCost = 128;
var moduleCost = 24;
var coreCost = 512;

var diskUpgrades = 0;
var memoryUpgrades = 0;
var networkUpgrades = 0;
var cpuUpgrades = 0;
var coreUpgrades = 0;
var moduleUpgrades = 0;

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
    $(document).keypress(function() {
        if (event.which == 13){
          gameLoop();
        }
    });
    setTimeout(
    function()
    {
      $(document).keypress(function() {
          if (event.which == 13){
            gameLoop();
          }
      });
    }, 10000);
  };
};

function begin(){
  $(document).keypress(function() {
      if (event.which == 13) powerCallback();
  });

  $('#powerOn').click(powerCallback);
};



function gameLoop(){
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


  $(document).keypress(function() {
    console.log(event.which);
    if (!$('#commandLine').is(':focus')) {
      if (event.which == 102 && firstInstruction == 1 && cycleBlocked != 1){
        fetch = 1;
        $("#fetch").css('color','#cfcfd3')
        firstInstruction = 0;
      }
      if (event.which == 102 && wb == 1 && cycleBlocked != 1){
        fetch = 1;
        wb = 0;
        $("#fetch").css('color','#cfcfd3')
      }
      if (event.which == 102 && cycleBlocked != 1){
        //log blocked cycle into terminal
      }

      if (event.which == 103 && fetch == 1){
        decode = 1;
        fetch = 0;
        $("#fetch").css('color', 'grey')
        $("#decode").css('color','#cfcfd3')
      }
      if (event.which == 104 && decode == 1){
        execute = 1;
        decode = 0;
        $("#decode").css('color', 'grey')
        $("#execute").css('color','#cfcfd3')
      }
      if (event.which == 106 && execute == 1){
        mem = 1;
        execute = 0;
        $("#execute").css('color', 'grey')
        $("#mem").css('color','#cfcfd3')
      }
      if (event.which == 107 && mem == 1){
        $("#mem").css('color', 'grey')
        if(diskUsed < disk){
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
          //log storage error
        }
      }
      if (event.which == 97){
        if(availableBlocks >= moduleCost){
          $("#moduleUpgrade").toggleClass('sufficient');
          setTimeout(
          function()
          {
            $("#moduleUpgrade").toggleClass('sufficient')
          }, 700);
          moduleUpgrades++;
          console.log(moduleUpgrades);
          availableBlocks= availableBlocks-moduleCost;
          processedBlocks+=moduleCost;
          $("#blocksProcessed").html(processedBlocks);
          $("#blocksAvailable").html(availableBlocks);
          moduleCost = moduleCost*4;
          $("#moduleCost").html(moduleCost);
          if(moduleUpgrades == 1){
            $("#taskAutomations").css("visibility", "visible");
          }
          else if(moduleUpgrades == 2){
            $("#resourceAllocation").css("visibility", "visible");
            //enable block-producing opportunities from connections
          }
          else if(moduleUpgrades == 3){
            $("#connections").css("visibility", "visible");
            $("#networkPercent").css("visibility", "visible")
            //enable block-producing opportunities from connections
          }
          else if(moduleUpgrades == 4){
            $("#assets").css("visibility", "visible");
            //enable money-making opportunities from connections
          }
          else if(moduleUpgrades == 5){
            $("#researchDevelopment").css("visibility", "visible");
          }
          else if(moduleUpgrades == 6){
            $("#realmStatus").css("visibility", "visible");
            $("#newsTicker").css("visibility", "visible");
            $("#moduleUpgrade").css("visibility", "hidden");
          }
          //log upgrade in console
        }
        else{
          $("#moduleUpgrade").toggleClass('insufficient');
          setTimeout(
          function()
          {
            $("#moduleUpgrade").toggleClass('insufficient')
          }, 700);
          //log not enough blocks
        }
      }
      if (event.which == 100){
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
          $("#blocksProcessed").html(processedBlocks);
          $("#blocksAvailable").html(availableBlocks);
          if(diskUpgrades == 2){
            $("#memoryUpgrade").css("visibility", "visible");
            $("#cpuUpgrade").css("visibility", "visible");
            $("#moduleUpgrade").css("visibility", "visible");
          }
          disk = disk*4;
          diskCost = diskCost*3;
          $("#diskCost").html(diskCost);
          $("#diskPercent").html((diskUsed/disk*100).toFixed(0) + "%");
          //log upgrade in console
        }
        else{
          $("#diskUpgrade").toggleClass('insufficient');
          setTimeout(
          function()
          {
            $("#diskUpgrade").toggleClass('insufficient')
          }, 700);
          //log not enough blocks
        }
      }
    }
    else{
      if (event.which == 13) command();
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

function command(){
  var str = $("#commandLine").val();
   var change = str.split(" ", 2);
   if(change[0] == "disk"){
      disk = parseInt(change[1]);
      $("#diskPercent").html((diskUsed/disk*100).toFixed(0) + "%");
   }
   else if(change[0] == "blocks"){
      availableBlocks = parseInt(change[1]);
      $("#blocksAvailable").html(availableBlocks);
   }
   else{
     $("#output").html("command not found");
   }
   $("#commandLine").val("");

}
