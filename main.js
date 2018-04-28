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
var memoryCost = 16;
var networkCost = 256;
var cpuCost = 128;
var moduleCost = 32;
var coreCost = 512;

var memoryUpgrades = 0;
var diskUpgrades = 0;
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

  $(document).keypress(function() {
    console.log(event.which);
      if (event.which == 102 && firstInstruction == 1 && cycleBlocked != 1){
        fetch = 1;
        $("#fetch").css('color','#cfcfd3')
        firstInstruction = 0;
      }
      if (event.which == 102 && wb == 1 && cycleBlocked != 1){
        fetch = 1;
        wb = 0;
        $("#wb").toggleClass('cycleFinished')
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
        $("#wb").toggleClass('cycleFinished')
        if(diskUsed < disk){
          wb = 1;
          mem = 0;
          createBlock();
        }
        else{
          cycleBlocked = 1;
          $("#wb").toggleClass('cycleBlocked')
          //log storage error
        }
      }

    });
};

function createBlock(){
    createdBlocks = createdBlocks + 1*cores;
    availableBlocks = availableBlocks + 1*cores;
    diskUsed+=1;
    $("#blocksAvailable").html(availableBlocks);
    $("#blocksCreated").html(createdBlocks);
    $("#diskPercent").html((diskUsed/disk)*100 + "%");
};
