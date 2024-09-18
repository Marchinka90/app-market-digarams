chrome.runtime.onInstalled.addListener(() => {
  console.log('I just install my chrome extentions');
});

chrome.bookmarks.onCreated.addListener(() => {
  console.log('I just bookmarked this page');
});