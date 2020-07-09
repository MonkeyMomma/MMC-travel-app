function getIconClass(icon) {

    let newIcon = "";

    switch (icon) {
        case "clear-day":
            newIcon = "sun";
            break;
        case "clear-night":
            newIcon = "moon";
            break;
        case "rain":
            newIcon = "rain";
            break;
        case "snow":
            newIcon = "snow";
            break;
        case "sleet":
            newIcon = "snow";
            break;
        case "wind":
            newIcon = "wind";
            break;
        case "fog":
            newIcon = "fog";
            break;
        case "cloudy":
            newIcon = "cloud";
            break;
        case "partly-cloudy-day":
            newIcon = "cloud-sun";
            break;
        case "partly-cloudy-night":
            newIcon = "cloud-sun-inv";
            break;
        default:
            newIcon = "sun";
    }

    newIcon = 'icon-' + newIcon;

    return newIcon ;

}

export { getIconClass }
