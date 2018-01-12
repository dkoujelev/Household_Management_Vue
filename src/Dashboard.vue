<template>
  <div id="dashboard">

      <div class="block">
        <div class="box">
          <a>
             <router-link to="/Test">prøving</router-link>
          </a>
          <a>
            <router-link to="/HelloWorld">Hello</router-link>
          </a>
          <a>
          <router-link to="/Task">Gjøremål</router-link>
          </a>
        </div>
      </div>


    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'dashboard'
}
</script>

<style>
#dashboard {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: black;
}
</style>
