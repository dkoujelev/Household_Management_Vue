<template>


    <div class="container">

      <div class="tile is-ancestor">
        <div class="tile is-vertical is-8">
          <div class="tile">
            <div class="tile is-parent is-vertical">
              <article class="tile is-child notification is-primary">
                <p class="title">Vertical...</p>
                <p class="subtitle">Top tile</p>
                <div class="content1">
                  <p>    keq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vq vkeq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq keq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vq vkeq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq keq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vq vkeq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq keq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vq vkeq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq keq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vq vkeq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq keq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vq vkeq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq keq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vq vkeq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vkeq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vq vkeq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vq</p>
                  <!-- Content -->
                </div>
              </article>
              <article class="tile is-child notification is-warning">
                <p class="title">...tiles</p>
                <p class="subtitle">Bottom tile</p>
              </article>
            </div>
            <div class="tile is-parent">
              <article class="tile is-child notification is-info">
                <p class="title">Middle tile</p>
                <p class="subtitle">With an image</p>
                <div class="myClass">
                  <figure class="image is-4by3">
                    <img src="./urban.jpg">
                  </figure>
                </div>
              </article>
            </div>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child notification is-danger">
              <p class="title">Wide tile</p>
              <p class="subtitle">Aligned with the right tile</p>
              <div class="content">
                <!-- Content -->
              </div>
            </article>
          </div>
        </div>



        <div class="tile is-parent">
          <article class="tile is-child notification is-success is-fixed">
            <div class="content">
              <p class="title">Tall tile</p>
              <p class="subtitle">With even more content</p>
              <div class="content">
                <p>    keq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vq vkeq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq keq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vq vkeq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq keq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vq vkeq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq keq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vq vkeq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq keq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vq vkeq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq keq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vq vkeq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq keq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vq vkeq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vkeq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vq vkeq vkqflkqml wflv fqw vlw vlw v fvlm vlmq flv leq vq</p>
                <!-- Content -->
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>




  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .FixedHeightContainer
  {
    float:right;
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

   .myClass {

    /** Trancparancy filter */
    opacity: 0.5;
    filter: alpha(opacity=50); /* For IE8 and earlier */


    /** Blured filter */
     -webkit-filter: blur(5px);
     -moz-filter: blur(5px);
     -o-filter: blur(5px);
     -ms-filter: blur(5px);
     filter: blur(5px);
  }





  /** syntax for picking spsific class: */
  div.tile.is-ancestor. {
    /** Trancparancy filter: */
    opacity: 1;
    filter: alpha(opacity=50); /* For IE8 and earlier */
  }

  .container {
    width: 100%;
    height: 100%;
    background-size: cover;

  }

  div.content1 {
    height:150px;
    overflow:auto;
    /**background:#fff;*/
  }

  .content
  {
    height: inherit;
    overflow:auto;
    /**background:#fff;*/
  }



</style>
