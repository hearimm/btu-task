import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Timeline from "./views/Timeline.vue";
import Explorer from "./views/Explorer.vue";
import Detail from "./views/Detail.vue";
import TaskAdd from "./views/TaskAdd.vue";
import TaskEdit from "./views/TaskEdit.vue";
import Ask from "./views/Ask.vue";
import AskAdd from "./views/AskAdd.vue";
import AskDetail from "./views/AskDetail.vue";
import Task from "./views/Task.vue";
import Cast from "./views/Cast.vue";
import CastAdd from "./views/CastAdd.vue";
import CastEdit from "./views/CastEdit.vue";
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
    }
  ]
});