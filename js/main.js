$(document).ready(function(e) {
    //MODALS
    $("#modal-1").hide(); //HOW TO PLAY
    $("#modal-2").hide(); // ABOUT
    $("#modal-3").hide(); // QUIT SCREEN
    $("#modal-4").hide(); //WINNER SCREEN
    $("#modal-5").hide(); //LOSE SCREEN
    $("#modal-6").hide(); //ASK THE AUDIENCE RESULTS
    $("#modal-7").show(); //ENTER NAME
    $(".question").hide();
    //Modal popup for Rules and About
    $("#btn-rules").click(function(e) {
        e.preventDefault();
        $("#modal-1").toggle(300);
        $(".parent").hide(300);
    });
    $("#btn-about").click(function(e) {
        e.preventDefault();
        $("#modal-2").toggle(300);
        $(".parent").hide(300);
    });

    //Close Modal
    //TO DO : FADEOUT
    $(".close").click(function(e) {
        e.preventDefault();
        $("#modal-1").hide(300);
        $("#modal-2").hide(300);
        $(".parent").show(300);
    });


    //Quit Screen Modal
    $("#quit").click(function(e) {
        e.preventDefault();
        $("#modal-3").toggle(300);
        $(".question").hide(300);
        $("#currentscore").empty().append("<strong>" + name + "</strong> your score is: <strong>" + score + "</strong>");
    });


    //Ask The Audience Modal
    $("#btn-audience").click(function(e) {
        e.preventDefault();
        $("#modal-6").toggle(300);
        $(".question").hide(300);
    });

    $("#clickname").click(function(e) {
        e.preventDefault();
        name = $("#name").val();
        $("#modal-7").hide(300);
        $(".question").show(300);
    });

    //Continue Game
    $("#continue").click(function(e) {
        e.preventDefault();
        $("#modal-3").toggle(300);

        $(".question").show(300);
    });
    $("#back").click(function(e) {
        e.preventDefault();
        $("#modal-6").toggle(300);
        $(".question").show(300);
    });
});