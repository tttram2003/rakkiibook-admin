// Hàm ẩn/hiện mật khẩu
function togglePasswordVisibility(inputId, toggleId) {
    var passwordInput = document.getElementById(inputId);
    var togglePasswordButton = document.getElementById(toggleId);

    // Chuyển đổi giữa type="password" và type="text"
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePasswordButton.src = 'img/icon/hide.png'; // Đổi hình ảnh mắt hiển thị
    } else {
        passwordInput.type = 'password';
        togglePasswordButton.src = 'img/icon/show.png'; // Đổi hình ảnh mắt ẩn
    }
}

// Hàm check các input đăng ký
function signUp(event) {
    var username = document.getElementById("user");
    var password = document.getElementById("pass");
    var confirmPassword = document.getElementById("repass");

    if (username.value === "" || username.value.length < 6 || username.value.includes(" ")) {
        displayErrorMessage(username, "Tên đăng nhập phải có ít nhất 6 ký tự");
        event.preventDefault();
    }

    if (password.value === "" || password.value.includes(" ") || password.value.length < 8 || !(/[A-Z]/.test(password.value)) || !(/[a-z]/.test(password.value)) || !(/[0-9]/.test(password.value))) {
        displayErrorMessage(password, "Mật khẩu phải có ít nhất 8 ký tự, bao gồm cả chữ thường, in hoa và số");
        event.preventDefault();
    }

    if (password.value !== confirmPassword.value) {
        displayErrorMessage(confirmPassword, "Mật khẩu nhập lại không khớp");
        event.preventDefault();
    }

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "user-admin-data.xml", false);
    xhr.send();
    var xmlDoc = xhr.responseXML;
    var users = xmlDoc.getElementsByTagName("admin");

    for (var i = 1; i < users.length; i++) {
        var xmlUsername = users[i].getElementsByTagName("username")[0].childNodes[0].nodeValue;
        if (username.value === xmlUsername) {
            displayErrorMessage(username, "Tên đăng nhập đã tồn tại");
            event.preventDefault();
            break;
        }
    }

    username.addEventListener("input", function() {
        clearErrorMessage(username);
    });

    password.addEventListener("input", function() {
        clearErrorMessage(password);
    });

    confirmPassword.addEventListener("input", function() {
        clearErrorMessage(confirmPassword);
    });
}

// Hàm hiển thị thông báo lỗi
function displayErrorMessage(element, message) {
    var existingErrorMessage = element.nextElementSibling;
    if (!existingErrorMessage || !existingErrorMessage.classList.contains('error-message')) {
        var errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;

        // Set the color and size of the error message
        errorMessage.style.color = 'red';
        errorMessage.style.fontSize = '12px';

        // Set position to absolute below the input
        errorMessage.style.position = 'absolute';
        errorMessage.style.top = '100%';
        errorMessage.style.left = 0;

        // Insert the error message after the input element
        element.parentNode.insertBefore(errorMessage, element.nextElementSibling);

        // Change input border color to red
        element.style.borderColor = 'red';

        // Increase the spacing between the inputs
        var inputBelow = element.closest('.input-form').nextElementSibling;
        if (inputBelow) {
            inputBelow.style.marginTop = '35px'; // Adjust the margin as needed
        }
    }
}
// Hàm xóa thông báo lỗi
function clearErrorMessage(element) {
    var existingErrorMessage = element.nextElementSibling;
    if (existingErrorMessage && existingErrorMessage.classList.contains('error-message')) {
        existingErrorMessage.remove();
        element.style.borderColor = '';
    }
}

// Hàm kiểm tra đăng nhập
function logIn() {
    var tenDangNhap = document.getElementById('user');
    var matKhau = document.getElementById('pass');
    var rememberMe = document.getElementById('rememberMe');

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var xmlDoc = this.responseXML;

            var users = xmlDoc.getElementsByTagName('admin');
            var loginSuccess = false;

            for (var i = 1; i < users.length; i++) {
                var username = users[i].getElementsByTagName('username')[0].textContent;
                var password = users[i].getElementsByTagName('password')[0].textContent;

                if (tenDangNhap.value === username && matKhau.value === password) {

                    // Nếu người dùng chọn "Nhớ đăng nhập", lưu thông tin đăng nhập vào localStorage
                    if (rememberMe.checked) {
                        localStorage.setItem('username', tenDangNhap.value);
                        localStorage.setItem('password', matKhau.value);
                        localStorage.setItem('rememberMe', true); // Lưu trạng thái của checkbox
                    } else {
                        // Nếu không chọn "Nhớ đăng nhập", xóa thông tin đã lưu
                        localStorage.removeItem('username');
                        localStorage.removeItem('password');
                        localStorage.removeItem('rememberMe');
                    }

                    window.location.href = 'admin-index.html';
                    loginSuccess = true;
                    break;
                }
            }

            if (!loginSuccess) {
                displayErrorMessage(tenDangNhap, "");
                displayErrorMessage(matKhau, "Tên đăng nhập hoặc mật khẩu không đúng!");

                // Xóa giá trị của trường nhập nếu nhập sai
                tenDangNhap.value = '';
                matKhau.value = '';

                tenDangNhap.addEventListener("input", function() {
                    clearErrorMessage(tenDangNhap);
                    clearErrorMessage(matKhau);
                });

                matKhau.addEventListener("input", function() {
                    clearErrorMessage(tenDangNhap);
                    clearErrorMessage(matKhau);
                });
            }
        }
    };
    xhttp.open('GET', 'user-admin-data.xml', true);
    xhttp.send();
}

// Hàm check username nếu quên mật khẩu
function checkUsername() {
    var usernameInput = document.getElementById("user").value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var xmlDoc = this.responseXML;
            var usernames = xmlDoc.getElementsByTagName("username");
            var found = false;
            for (var i = 1; i < usernames.length; i++) {
                if (usernames[i].textContent === usernameInput) {
                  document.getElementById("pass").disabled = false;
                  document.getElementById("repass").disabled = false;
                  found = true;
                  break;
                }
            }
            if (!found) {
              document.getElementById("pass").disabled = true;
              document.getElementById("repass").disabled = true;
            }
        }
    }
    xhttp.open('GET', 'user-admin-data.xml', true);
    xhttp.send();
}

// Hàm check mật khẩu mới
function checkNewPass(event){
    var newPass = document.getElementById("pass");
    var confirmNewPass = document.getElementById("repass");

    if (newPass.value === "" || newPass.value.includes(" ") || newPass.value.length < 8 || !(/[A-Z]/.test(newPass.value)) || !(/[a-z]/.test(newPass.value)) || !(/[0-9]/.test(newPass.value))) {
        displayErrorMessage(newPass, "Mật khẩu phải có ít nhất 8 ký tự, bao gồm cả chữ thường, in hoa và số");
        event.preventDefault();
    }

    if (newPass.value !== confirmNewPass.value) {
        displayErrorMessage(confirmNewPass, "Mật khẩu nhập lại không khớp");
        event.preventDefault();
    }

    newPass.addEventListener("input", function() {
        clearErrorMessage(newPass);
    });

    confirmNewPass.addEventListener("input", function() {
        clearErrorMessage(confirmNewPass);
    });

}


