import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation'
import screens from 'constants/screens'
import Loading from 'shared/pages/Loading'
import SignIn from 'pages/SignIn'
import SignUp from 'pages/SignUp'
import Projects from 'pages/Projects'
import InitScreen from 'pages/InitScreen'
import ForgotPassword from 'pages/ForgotPassword'
import CreateProposal from 'pages/CreateProposal'
import Settings from 'pages/Settings'
import Users from 'pages/Users'
import InviteUser from 'pages/InviteUser'
import MyProfile from 'pages/MyProfile'
import Roles from 'pages/Roles'
import EditRole from 'pages/EditRole'
import CreateRole from 'pages/CreateRole'
import CreateLineItem from 'pages/createProposal/CreateLineItem'
import SetPaymentPlan from 'pages/createProposal/SetPaymentPlan'
import EditDeposit from 'pages/createProposal/EditDeposit'
import ProjectAddress from 'pages/createProposal/ProjectAddress'
import MailingAddress from 'pages/createProposal/MailingAddress'
import AmountToFinance from 'pages/createProposal/AmountToFinance'
import ScheduleOfProgressPayments from 'pages/createProposal/ScheduleOfProgressPayments'
import ProgressPaymentsPhase from 'pages/createProposal/ProgressPaymentsPhase'
import Agreements from 'pages/createProposal/Agreements'
import ProposalSignature from 'pages/createProposal/ProposalSignature'
import Project from 'pages/Project'
import ProjectAdmins from 'pages/project/ProjectAdmins'
import CreateWorkOrder from 'pages/CreateWorkOrder'
import WorkOrderLineItem from 'pages/createWorkOrder/WorkOrderLineItem'
import InvitedSubs from 'pages/InvitedSubs'
import WorkOrderInvites from 'pages/WorkOrderInvites'
import Chat from 'pages/Chat'
import WorkOrderInfo from 'pages/WorkOrderInfo'
import ProjectInfo from 'pages/ProjectInfo'
import VerifyLicense from 'pages/VerifyLicense'

const navigatorConfig = {
  defaultNavigationOptions: {
    header: null
  }
}

const App = createStackNavigator(
  {
    [screens.PROJECTS]: Projects,
    [screens.CREATE_PROPOSAL]: CreateProposal,
    [screens.SETTINGS]: Settings,
    [screens.USERS]: Users,
    [screens.INVITE_USER]: InviteUser,
    [screens.ROLES]: Roles,
    [screens.EDIT_ROLE]: EditRole,
    [screens.CREATE_ROLE]: CreateRole,
    [screens.CREATE_LINE_ITEM]: CreateLineItem,
    [screens.SET_PAYMENT_PLAN]: SetPaymentPlan,
    [screens.EDIT_DEPOSIT]: EditDeposit,
    [screens.PROJECT_ADDRESS]: ProjectAddress,
    [screens.MAILING_ADDRESS]: MailingAddress,
    [screens.AMOUNT_TO_FINANCE]: AmountToFinance,
    [screens.SCHEDULE_OF_PROGRESS_PAYMENTS]: ScheduleOfProgressPayments,
    [screens.PROGRESS_PAYMENTS_PHASE]: ProgressPaymentsPhase,
    [screens.AGREEMENTS]: Agreements,
    [screens.PROPOSAL_SIGNATURE]: ProposalSignature,
    [screens.PROJECT]: Project,
    [screens.PROJECT_ADMINS]: ProjectAdmins,
    [screens.CREATE_WORK_ORDER]: CreateWorkOrder,
    [screens.WORK_ORDER_LINE_ITEM]: WorkOrderLineItem,
    [screens.INVITED_SUBS]: InvitedSubs,
    [screens.WORK_ORDER_INVITES]: WorkOrderInvites,
    [screens.CHAT]: Chat,
    [screens.PROFILES]: MyProfile,
    [screens.WORK_ORDER_INFO]: WorkOrderInfo,
    [screens.PROJECT_INFO]: ProjectInfo,
    [screens.VERIFY_LICENSE]: VerifyLicense
  },
  navigatorConfig
)

const AuthStack = createStackNavigator(
  {
    [screens.INIT_SCREEN]: InitScreen,
    [screens.SIGN_IN]: SignIn,
    [screens.SIGN_UP]: SignUp,
    [screens.FORGOT_PASSWORD]: ForgotPassword
  },
  navigatorConfig
)

const RootNavigator = createSwitchNavigator(
  {
    [screens.LOADING]: Loading,
    [screens.AUTH]: AuthStack,
    [screens.APP]: App
  },
  {
    initialRouteName: screens.LOADING
  }
)

export const AppContainer = createAppContainer(RootNavigator)
