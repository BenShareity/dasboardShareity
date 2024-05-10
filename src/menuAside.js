import {
    mdiSquareEditOutline,
    mdiResponsive,
    mdiPalette,
    mdiHome,
    mdiAccount,
    mdiAccountMultiple,
    mdiAccountGroup,
    mdiStar,
    mdiCreditCard,
    mdiCash,
    mdiPhone,
    mdiChatQuestion,
    mdiChat,
    mdiAccountSupervisor
} from "@mdi/js";

export default {
    profile: {
        to: "/profile",
        label: "Profile",
        icon: mdiAccount,
    },
    dashboard: {
        to: "/dashboard",
        label: "Dashboard",
        icon: mdiHome,
    },
    users: {
        to: "/users",
        label: "All Users",
        icon: mdiAccountMultiple,
    },
    campaigns: {
        to: "/campaigns",
        label: "Campaigns",
        icon: mdiSquareEditOutline,
    },
    sponsors: {
        to: "/sponsors",
        label: "Sponsors",
        icon: mdiResponsive,
    },
    agencies: {
        to: "/agencies",
        label: "Agencies",
        icon: mdiResponsive,
    },
    causes: {
        to: "/causes",
        label: "Causes",
        icon: mdiPalette,
    },
    // // {
    // //   to: "/profile",
    // //   label: "Influencers",
    // //   icon: mdiStar,
    // // },
    // // {
    // //   to: "/login",
    // //   label: "Agencies",
    // //   icon: mdiLock,
    // // },
    "rewards-messages": {
        to: "/rewards-messages",
        label: "Rewards & Messages",
        icon: mdiStar,
    },
    "community-message": {
        to: "/community-message",
        label: "Community Message",
        icon: mdiAccountGroup,
    },
    credits: {
        to: "/credits",
        label: "Credits",
        icon: mdiCreditCard,
    },
    pledges: {
        to: "/pledges",
        label: "Pledges",
        icon: mdiCash,
    },
    "phone-campaigns": {
        to: "/phone-campaigns",
        label: "Campaing's Phone Number",
        icon: mdiPhone,
    },
    faq: {
        to: "/faq",
        label: "FaQ",
        icon: mdiChatQuestion,
    },
    "chat-steve": {
        to: "/chat-steve",
        label: "Steve",
        icon: mdiChat,
    },
    "users-credits": {
        to: "/users-credits",
        label: "User's Credits",
        icon: mdiCreditCard,
    },
    "friends": {
        to: '/friends',
        label: "Friends",
        icon: mdiAccountSupervisor
    }
    // {
    //   to: "/error",
    //   label: "Approve",
    //   icon: mdiAlertCircle,
    // },
    // {
    //   to: "/error",
    //   label: "Delete Challenge",
    //   icon: mdiAlertCircle,
    // },
    // {
    //   label: "Reports",
    //   icon: mdiViewList,
    //   menu: [
    //     {
    //       label: "Users",
    //     },
    //     {
    //       label: "Challenges",
    //     },
    //     {
    //       label: "cause",
    //     },
    //     {
    //       label: "Sponsors",
    //     },
    //   ],
    // },
    // {
    //   to: "/error",
    //   label: "Text Code",
    //   icon: mdiAlertCircle,
    // },
    // {
    //   to: "/error",
    //   label: "Spin Wheel",
    //   icon: mdiAlertCircle,
    // },
    // {
    //   to: "/error",
    //   label: "Change Splash",
    //   icon: mdiAlertCircle,
    // },
    // {
    //   to: "/error",
    //   label: "Blog",
    //   icon: mdiAlertCircle,
    // },
    // {
    //   to: "/error",
    //   label: "Speaks",
    //   icon: mdiAlertCircle,
    // },
    // {
    //   to: "/error",
    //   label: "Twilio Phone Number",
    //   icon: mdiAlertCircle,
    // },
};