import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
const routes = [
  {
    meta: {
      title: "Login",
    },
    path: "/",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    meta: {
      title: "Register",
    },
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterView.vue"),
  },
  {
    meta: {
      title: "Verify",
    },
    path: "/email-validation",
    name: "email-validation",
    component: () => import("@/views/email-validation.vue"),
  },

  {
    meta: {
      title: "Message Register",
    },
    path: "/message-register",
    name: "Message register",
    component: () => import("@/views/MessageRegister.vue"),
  },
  {
    meta: {
      title: "Message-new-Register",
    },
    path: "/message-new-register",
    name: "Message-Register",

    component: () => import("@/views/MessageNewRegister.vue"),
  },
  // {
  //   meta: {
  //     title: "Select style",
  //   },
  //   path: "/",
  //   name: "style",
  //   component: () => import("@/views/StyleView.vue"),
  // },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: "Dashboard",
    },
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: "All Users",
    },
    path: "/users",
    name: "users",
    component: () => import("@/views/AllUsersView.vue"),
  },
  {
    meta: {
      title: "Campaigns",
    },
    path: "/campaigns",
    name: "campaigns",
    component: () => import("@/views/CampaignsView.vue"),
  },
  {
    meta: {
      title: "Challenge Info",
    },
    path: "/campaigns/info",
    name: "campaigns/info",
    component: () => import("@/views/ChallengeInfoView.vue"),
  },
  {
    meta: {
      title: "Create Challenge",
    },
    path: "/campaigns/form/:id",
    name: "campaigns/create",
    component: () => import("@/views/CreateChallengeView.vue"),
  },
  {
    meta: {
      title: "Sponsors",
    },
    path: "/sponsors",
    name: "sponsors",
    component: () => import("@/views/SponsorsView.vue"),
  },
  {
    meta: {
      title: "Create Sponsor",
    },
    path: "/create-sponsor",
    name: "create-sponsor",
    component: () => import("@/views/CreateSponsorView.vue"),
  },
  {
    meta: {
      title: "Causes",
    },
    path: "/causes",
    name: "causes",
    component: () => import("@/views/CausesView.vue"),
  },
  {
    meta: {
      title: "Create Cause",
    },
    path: "/create-cause",
    name: "create-cause",
    component: () => import("@/views/CreateCauseView.vue"),
  },
  {
    meta: {
      title: "Create Agency",
    },
    path: "/create-agency",
    name: "create-agency",
    component: () => import("@/views/CreateAgencyView.vue"),
  },
  {
    meta: {
      title: "Agencies",
    },
    path: "/agencies",
    name: "agencies",
    component: () => import("@/views/AgenciesView.vue"),
  },
  {
    meta: {
      title: "Rewards & Messages",
    },
    path: "/rewards-messages",
    name: "rewards-messages",
    component: () => import("@/views/Rewards&MessagesView.vue"),
  },
  {
    meta: {
      title: "Create Reward",
    },
    path: "/create-reward",
    name: "create-reward",
    component: () => import("@/views/CreateRewardView.vue"),
  },
  {
    meta: {
      title: "Create Message",
    },
    path: "/create-message",
    name: "create-message",
    component: () => import("@/views/CreateMessageView.vue"),
  },
  {
    meta: {
      title: "Community Message",
    },
    path: "/community-message",
    name: "comunity-message",
    component: () => import("@/views/ComunityMessageView.vue"),
  },
  {
    meta: {
      title: "Credits",
    },
    path: "/credits",
    name: "credits",
    component: () => import("@/views/CreditsView.vue"),
  },
  {
    meta: {
      title: "Credit History",
    },
    path: "/credits-history",
    name: "credits-history",
    component: () => import("@/views/CreditsHistoryView.vue"),
  },
  {
    meta: {
      title: "Processing credits",
    },
    path: "/credits-validate/:token/:amount",
    name: "credits-validate",
    props: true,
    component: () => import("@/views/CreditsValidateView.vue"),
  },
  {
    meta: {
      title: "Pledges",
    },
    path: "/pledges",
    name: "pledges",
    component: () => import("@/views/PledgesView.vue"),
  },
  {
    meta: {
      title: "Presentation",
    },
    path: "/presentation",
    name: "presentation",
    component: () => import("@/views/PresentationView.vue"),
  },
  {
    meta: {
      title: "Tables",
    },
    path: "/tables",
    name: "tables",
    component: () => import("@/views/TablesView.vue"),
  },
  {
    meta: {
      title: "Forms",
    },
    path: "/forms",
    name: "forms",
    component: () => import("@/views/FormsView.vue"),
  },
  {
    meta: {
      title: "chat-steve",
    },
    path: "/chat-steve",
    name: "chat-steve",
    component: () => import("@/views/ChatSteveView.vue"),
  },
  // {
  //   meta: {
  //     title: "Profile",
  //   },
  //   path: "/profile",
  //   name: "profile",
  //   component: () => import("@/views/ProfileView.vue"),
  // },
  {
    meta: {
      title: "Ui",
    },
    path: "/ui",
    name: "ui",
    component: () => import("@/views/UiView.vue"),
  },
  {
    meta: {
      title: "Responsive layout",
    },
    path: "/responsive",
    name: "responsive",
    component: () => import("@/views/ResponsiveView.vue"),
  },
  {
    meta: {
      title: "Error",
    },
    path: "/error",
    name: "error",
    component: () => import("@/views/ErrorView.vue"),
  },
  {
    meta: {
      title: "Profile",
    },
    path: "/profile",
    name: "profile",
    component: () => import("@/views/ProfileView.vue"),
  },
  {
    meta: {
      title: "Create admin",
    },
    path: "/create-admin",
    name: "create-admin",
    component: () => import("@/views/CreateAdminView.vue"),
  },
  {
    meta: {
      title: "Campaign's Phone Number",
    },
    path: "/phone-campaigns",
    name: "phone-campaigns",
    component: () => import("@/views/CampaignsPhoneView.vue"),
  },
  {
    meta: {
      title: "FaQ",
    },
    path: "/faq",
    name: "FaQ",
    component: () => import("@/views/FaQView.vue"),
  },
  {
    meta: {
      title: "Create FaQ",
    },
    path: "/createfaq",
    name: "createfaq",
    component: () => import("@/views/CreateFaqView.vue"),
  },

  {
    meta: {
      title: "Credits Assign",
    },
    path: "/users-credits",
    name: "users-credits",
    component: () => import("@/views/CreditsAssignView.vue"),
  },
  {
    meta: {
      title: "Friends",
    },
    path: "/friends",
    name: "friends",
    component: () => import("@/views/FriendsView.vue"),
  },

  {
    meta: {
      title: "Friends-Chat",
    },
    path: "/friends/chat/:id",
    name: "friends-chat",
    component: () => import("@/views/ChatFriendView.vue"),
  },

  {
    meta: {
      title: "test",
    },
    path: "/test/:id",
    name: "test",
    component: () => import("@/views/CreateChallengeView1.vue"),
  },
  {
    meta: {
      title: "Credits Assign",
    },
    path: "/users-credits",
    name: "users-credits",
    component: () => import("@/views/CreditsAssignView.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

export default router;
