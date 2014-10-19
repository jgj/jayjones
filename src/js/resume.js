(function() {

    var btnPrint = document.querySelector(".btn-print"),
        btnPDF = document.querySelector(".btn-pdf"),
        btnSend = document.querySelector(".btn-send"),
        btnContact = document.querySelector(".btn-contact"),
        sendDialog = document.querySelector(".send-dialog"),
        contactDialog = document.querySelector(".contact-dialog"),
        sendForm = document.querySelector(".send-form"),
        contactForm = document.querySelector(".contact-form"),
        xhropts = {"Accept": "application/json", "Content-Type": "application/json; charset=UTF-8"},
        loader;


    document.addEventListener("DOMContentLoaded", function(event) {
        initEvents();
        initNotifications();
    });

    function initNotifications() {
        humane.loading = humane.spawn({addnClas: 'loading', timeout: 0});
        humane.info = humane.spawn({addnCls: 'info', clickToClose: true, timeout: 3000});
        humane.success = humane.spawn({addnCls: 'success', clickToClose: true, timeout: 3000});
        humane.error = humane.spawn({addnCls: 'error', clickToClose: true, timeout: 3000});
    }

    function initEvents() {
        btnPrint.addEventListener("click", function(event) {
            window.print();
        });

        btnPDF.addEventListener("click", function(event) {
            window.location.assign("/resume/pdf/");
        });

        btnSend.addEventListener("click", function(event) { openDialog(event, sendDialog) });
        btnContact.addEventListener("click", function(event) { openDialog(event, contactDialog) });

        sendForm.addEventListener("submit", handleFormSubmit);
        sendForm.addEventListener("reset", handleFormReset);

        contactForm.addEventListener("submit", handleFormSubmit);
        contactForm.addEventListener("reset", handleFormReset);
    }

    function openDialog(event, dialog) {
        dialog.classList.remove("hidden");
        dialog.querySelector("input").focus();
        dialog.addEventListener("click", closeDialog);
    }

    function closeDialog(event) {
        var el = event.target;
        if(event.type === "click" && el.classList.contains('dialog')) {
            el.classList.add("hidden");
            el.removeEventListener("click", closeDialog);
        } else if(event.type === "submit") {
            el.parentElement.classList.add("hidden");
            el.parentElement.removeEventListener("click", closeDialog);
        }
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        doFormSubmit(event.target);
        closeDialog(event);
    }

    function handleFormReset(event) {
        event.target.querySelector("textarea").innerHTML = "";
    }

    function showLoading(msg) {
        msg = msg || "Loading";
        hideLoading();
        return humane.loading('<i class="fa fa-spinner fa-spin"></i> ' + msg);
    }

    function hideLoading(loader) {
        if(loader) loader.remove(function() { loader = null; });
    }

    function doFormSubmit(form) {
        var data = Former.get(form, true);

        loader = showLoading();

        promise.post(form.action, data, xhropts).then(function(err, resp, xhr) {
            hideLoading(loader);
            resp = JSON.parse(resp);

            if(xhr.status === 200 && resp.success) {
                humane.info("Your message has been sent. Thank you for sharing.");
            } else {
                humane.error("Oops! An error occured while sending your message.");
            }
        });
    }


})();
