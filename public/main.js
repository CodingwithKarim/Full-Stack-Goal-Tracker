var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");
var thumbDown = document.getElementsByClassName("fa-thumbs-down");
var filter = document.getElementsByClassName("fas fa-radiation-alt");
var toDoList = document.querySelectorAll("li");
var check = document.getElementsByClassName("fas fa-check-square");
var filterCheck = document.getElementsByClassName("fas fa-filter");
var updateBtn = document.getElementsByClassName("updateBtn");
counter = document.querySelector("#countBtn");
counter.innerText = `${toDoList.length}`;

Array.from(check).forEach(function (element) {
  console.log("wow");
  element.addEventListener("click", function () {
    console.log(this.parentNode.parentNode.childNodes[0]);
    const name = this.parentNode.parentNode.childNodes[1].value;
    const msg = this.parentNode.parentNode.childNodes[5].value;
    const _id = this.parentNode.parentNode.childNodes[11].innerText;
    fetch("messages", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        msg: msg,
        _id: _id,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload(true);
      });
  });
});

Array.from(check).forEach(function (element) {
  element.addEventListener("click", function () {
    console.log("Hello");
    console.log(this.parentNode.parentNode.childNodes);

    const name = this.parentNode.parentNode.childNodes[1].innerText;
    const msg = this.parentNode.parentNode.childNodes[3].innerText;
    const date = this.parentNode.parentNode.childNodes[1];
    const filter = date.classList.add("success");
    const task = this.parentNode.parentNode.childNodes[3];
    const filter1 = task.classList.add("success");

    fetch("completed", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        msg: msg,
        filter: filter,
        date: date,
        task: task,
        filter1: filter1,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((data) => {
        console.log(data);
        // window.location.reload(true);
      });
  });
});

Array.from(trash).forEach(function (element) {
  element.addEventListener("click", function () {
    console.log(this.parentNode.parentNode.childNodes)
    const name = this.parentNode.parentNode.childNodes[3].innerText;
    const msg = this.parentNode.parentNode.childNodes[5].innerText;

    fetch("messages", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        msg: msg,
      }),
    }).then(function (response) {
      window.location.reload();
    });
  });
});

Array.from(filter).forEach(function (element) {
  element.addEventListener("click", function () {
    const name = document.querySelector(".try").innerText;
    // const name = this.parentNode.parentNode.childNodes[1].innerText
    // const msg = document.querySelector("span").innerText;
    fetch("filter", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        // msg: msg,
      }),
    }).then(function (response) {
      window.location.reload();
    });
  });
});

Array.from(filterCheck).forEach(function (element) {
  element.addEventListener("click", function () {
    const name = document.querySelector(".success").innerText;
    // const bame = document.querySelector('.try')
    // // const name = this.parentNode.parentNode.childNodes[1].innerText
    // const msg = document.querySelector("span").innerText;

    fetch("filter1", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        // msg: msg,
      }),
    }).then(function (response) {
      window.location.reload();
    });
  });
});
