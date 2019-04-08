import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Explorer from "./views/Explorer.vue";
import Detail from "./views/Detail.vue";
import AddTask from "./views/AddTask.vue";
import Ask from "./views/Ask.vue";
import AskDetail from "./views/AskDetail.vue";
import Task from "./views/Task.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/explorer",
      name: "explorer",
      component: Explorer
    },
    {
      path: "/detail",
      name: "detail",
      component: Detail
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
      component: AddTask
    },

    {
      path: "/addTask",
      name: "addTask",
      component: AddTask
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
      path: "/addAsk",
      name: "askDetail",
      component: AskDetail
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
