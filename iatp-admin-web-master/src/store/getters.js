const getters = {
    buttons: state => state.user.userMenus.buttons,
    seeTestList: state => state.testPaper.seeTestList,
    imgIds: state => state.knowledge.knowledgeImages,
    userId: state => state.user.userId
}
export default getters