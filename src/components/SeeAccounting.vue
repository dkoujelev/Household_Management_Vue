<template>
  <div class="app">
    <div class="block">
      <h1 class="title is-3">Regnskap</h1>
      <router-link class="button" to="#">Nytt regnskap</router-link>
      <div class="dropdown is-active is-pulled-right">
        <div class="dropdown-trigger">
          <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
            <span>Velg regnskap</span>
            <span class="icon is-small">
        <i class="fa fa-angle-down" aria-hidden="true"></i>
      </span>
          </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
          <div class="dropdown-content">
            <a href="#" class="dropdown-item">
              Dropdown item
            </a>
          </div>
        </div>
      </div>
      <br>
      <br>
      <table class="table is-striped is-bordered is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>Navn på liste</th>
            <th>Når</th>
            <th>Sum</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Helg</th>
            <th>21.01.2018</th>
            <th>495.00</th>
          </tr>
          <tr>
            <th>Mat hverdag</th>
            <th>27.01.2018</th>
            <th>495.00</th>
          </tr>
          <tr>
            <th>Renhold</th>
            <th>31.01.2018</th>
            <th>495.00</th>
          </tr>
        </tbody>
        <tfoot>
        <tr>
          <th>Total</th>
          <th></th>
          <th>1485.00</th>
        </tr>
        </tfoot>
      </table>
          <router-link class="button" to="/AddExpence">Legg til utgift</router-link>
      <br>
      <br>
      </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /*export default {
      name: 'SeeAccounting',
      components: {addExpence},

    data(){

    },
  }*/
</script>
