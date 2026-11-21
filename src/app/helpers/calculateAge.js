
export function calculateAge(dobString, currentDate) {
    var dob = new Date(dobString);
    var currentYear = currentDate.getFullYear();
    var birthdayThisYear = new Date(currentYear, dob.getMonth(), dob.getDate());
    var age = currentYear - dob.getFullYear();

    if (birthdayThisYear > currentDate) {
        age--;
    }

    return age;
}