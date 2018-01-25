<template>

  <!-- <div class="tile is-vertical box" style="background-color: white">
    <div class="title"> Mitt Regnskap: <br> </div>
    <div class="tile is-ancestor" style="background-color: white">

    <div class="column">
      <div class="tile is-child box" style="background-color: white">
        <GjeldInn :current_user="$parent.current_user"> </GjeldInn>

      </div>
    </div>

      <div class="column">
      <div class="tile is-child box" style="background-color: white">
        <GjeldUt :current_user="$parent.current_user"></GjeldUt>
      </div>
      </div>
    </div>
  </div> -->




  <div class="tile is-ancestor">
    <div class="tile is-parent">
      <article class="tile is-child">
        <div class="container">
          <div class="FixedHeightContainer">
            <h2>Title</h2>
            <div class="Content">
              blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah... ..blah blah blah...
            </div>

          </div>
        </div>



      </article>
    </div>




  </div>






</template>


<!--<div class="columns is-mobile">
              <div class="column">1</div>
              <div class="column">2</div>
              <div class="column">3</div>
              <div class="column">4</div>
            </div> -->

<!--- <div class="box" style="background-color: white">
    <div class="title"> Mitt Regnskap <br> </div>




      <div class="columns">
        <div class="column is half"> </div>
        <div class="box is-one-third"> <GjeldInn :current_user="$parent.current_user"> </GjeldInn>  </div>
        <div class="column is-"> </div>
        <div class="box is-one-third">  <GjeldUt :current_user="$parent.current_user"></GjeldUt>  </div>


      </div>
    </div>
  </div> -->

<!-- <div class="tile is-vertical">
  <div class="tile is-ancestor">
    <div class=" tile is-parent">
      <div class="tile is-child box" style="background-color: lightskyblue">
        <Newsfeedhome></Newsfeedhome>
      </div>
    </div>
  </div>
  <div class="tile is-ancestor box" style="background-color: fuchsia">
    <div class="tile is-parent box" style="background-color: greenyellow">
      <div class="tile is-child box is-half" style="background-color: blue">
        <Shoppinglistshome></Shoppinglistshome>
      </div>
    </div>
    <div class="tile is-parent box" style="background-color: aquamarine">
      <div class="tile is-child box is-half" style="background-color: red">
        <Shoppinglistshome></Shoppinglistshome>
      </div>
    </div>
  </div>
</div> -->


<script>
  import GjeldInn from '@/components/Gjeld/GjeldInn'
  import GjeldUt from '@/components/Gjeld/GjeldUt'
  export default {
    components: {GjeldInn, GjeldUt}
  }
</script>

<style scoped>
  .FixedHeightContainer
  {
    /** float:right; */
    height: 250px;
    width:250px;
    padding:3px;
    background:#f00;
  }
  .Content
  {
    height:200px;
    overflow:auto;
    /**background:#fff;*/
  }
</style>
