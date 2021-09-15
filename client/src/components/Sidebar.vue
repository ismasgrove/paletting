<script setup lang='ts'>

</script>

<template>
    <div class='sidebar-container'>
            <!-- <img width=300 height=65 src='../assets/header.png' /> -->
            <h1>color<i>dump</i></h1>
            <h5>low-effort palette generator for your procedural needs</h5>
            <!-- <div class='buttons'> -->
            <!-- <button>color</button> <br /> -->
            <!-- <button>image</button> -->
            <!-- </div>             -->
    </div>
</template>

<style scoped lang='scss'>

// $container-top: #d365ff;
// $container-bot: #fa5eff;
// $main-color: linear-gradient($container-top, $container-bot);
$container-color: #fea3aa;
$buttons-color: #be6068;
$main-color: $container-color;

$sidebar-margins: 5rem;
// $main-color:#d365ff;
.sidebar-container {
    display: flex;
    flex-direction: column;
    z-index: 5;
    background: $main-color;
    color: white;
    height: 100%;
    border-radius: 15px;
    justify-content: center;
    align-items: center;
    width: 30rem;
}
.middle-section {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-items: center;
}
img {
    align-self: flex-start;
    margin-left: 2rem;
}
h1 {
    justify-self: start;
    align-self: flex-start;
    margin-bottom: 1rem;
    margin-left: $sidebar-margins;
    margin-right: $sidebar-margins;
    font-size: 40px;
    font-weight: 400;
    i {
    font-weight: 600;
    font-style: italic;
    color: #ffffff;
}

}
h5 {
    margin-top: 0px;
    text-align: start;
    margin-left: $sidebar-margins;
    margin-right: $sidebar-margins;
    font-size: 18px;
    font-weight: normal;
    align-self: flex-start;
}
button {
    border: 0px;
    border-radius: 40px;
    height: 2rem;
    width: 7rem;
    margin-bottom: 5px;
    font-family: Arial;
    font-size: 16px;
    color: white;
    background-color: $buttons-color;
}
.buttons {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
}
</style>