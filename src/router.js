import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Timeline from "./views/Timeline.vue";
import TimelineQuery from "./views/TimelineQuery.vue";
import Calendar from "./views/Calendar.vue";
import Explorer from "./views/Explorer.vue";
import Detail from "./views/Detail.vue";
import Ask from "./views/Ask.vue";
import AskAdd from "./views/AskAdd.vue";
import AskDetail from "./views/AskDetail.vue";
import Task from "./views/Task.vue";
import TaskAdd from "./views/TaskAdd.vue";
import TaskEdit from "./views/TaskEdit.vue";
import Preset from "./views/Preset.vue";
import PresetAdd from "./views/PresetAdd.vue";
import PresetEdit from "./views/PresetEdit.vue";
import Cast from "./views/Cast.vue";
import CastAdd from "./views/CastAdd.vue";
import CastEdit from "./views/CastEdit.vue";
import Account from "./views/Account.vue";
import Admin from "./views/Admin.vue";
import Auth from "./views/Auth.vue";
import store from "./store";

Vue.use(Router);

function requireAuth(to, from, next) {
  if (!store.getters["isUserAuthenticated"]) {
    next({
      path: '/auth',
      query: {
        redirect: to.fullPath
      }
    })
  } else {
    next()
  }
}

export default new Router({
  routes: [{
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/timeline",
    name: "timeline",
    component: Timeline
  },
  {
    path: "/timelineQuery/:date",
    name: "timelineQuery",
    component: TimelineQuery,
    props: true
  },
  {
    path: "/calendar",
    name: "calendar",
    component: Calendar
  },
  {
    path: "/explorer",
    name: "explorer",
    component: Explorer
  },
  {
    path: "/detail/:id",
    name: "detail",
    props: true,
    component: Detail
  },
  {
    path: "/cast",
    name: "cast",
    component: Cast
  },
  {
    path: "/castAdd",
    name: "castAdd",
    beforeEnter: requireAuth,
    component: CastAdd
  },
  {
    path: "/cast/:id",
    name: "castEdit",
    props: true,
    beforeEnter: requireAuth,
    component: CastEdit
  },
  {
    path: "/task",
    name: "task",
    component: Task
  },
  {
    path: "/task/:id",
    name: "taskDetail",
    props: true,
    beforeEnter: requireAuth,
    component: TaskEdit
  },
  {
    path: "/taskAdd",
    name: "taskAdd",
    props: true,
    beforeEnter: requireAuth,
    component: TaskAdd
  },


  {
    path: "/preset",
    name: "preset",
    component: Preset
  },
  {
    path: "/preset/:id",
    name: "presetDetail",
    props: true,
    beforeEnter: requireAuth,
    component: PresetEdit
  },
  {
    path: "/presetAdd",
    name: "presetAdd",
    props: true,
    beforeEnter: requireAuth,
    component: PresetAdd
  },

  {
    path: "/ask",
    name: "ask",
    component: Ask
  },
  {
    path: "/ask/:id",
    name: "askDetail",
    props: true,
    component: AskDetail
  },
  {
    path: "/askAdd",
    name: "askAdd",
    beforeEnter: requireAuth,
    component: AskAdd
  },
  {
    path: "/account/:id",
    name: "account",
    props: true,
    component: Account
  },
  {
    path: "/admin",
    name: "admin",
    component: Admin
  },
  {
    path: "/auth",
    name: "auth",
    component: Auth
  },
  {
    path: '/logout',
    beforeEnter(to, from, next) {
      store.dispatch("signOut");
      next('/')
    }
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import( /* webpackChunkName: "about" */ "./views/About.vue")
  },
  {
    path: "/telegram",
    name: "telegram",

    beforeEnter() {
      location.href = 'https://t.me/sbs_ten_notice'
    },
  },
  {
    path: "/podjuk",
    name: "podjuk",
    beforeEnter() {
      location.href = 'https://podjuk.com'
    },
  },
  ]
});