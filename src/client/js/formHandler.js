function handleForm(event) {
    event.preventDefault()

    // Validate entry information
    let formStreetNumber = document.getElementById('streetnumber').value;
    let formStreetName = document.getElementById('streetname').value;
    let formStreetType = document.getElementById('streettype').value;
    let formCity = document.getElementById('city').value;
    let formDateFrom = document.getElementById('datefrom').value;

    console.log("::: streetnumber :::", formStreetNumber);
    console.log("::: streetname :::", formStreetName);
    console.log("::: streettype :::", formStreetType);
    console.log("::: city :::", formCity);
    console.log("::: datefrom :::", formDateFrom);

    // async function to post form data to backend
    async function postFormData(url = '', data = {}) {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        return response.json();
      }

      // Verify information for validity, if successful go ahead
      postFormData('http://localhost:8001/travel', {streetnumber: formStreetNumber,
                                                    streetname: formStreetName,
                                                    streettype: formStreetType,
                                                    city: formCity,
                                                    datefrom: formDateFrom})
      .then((data) => {
        console.log('DATA')
        console.log(data); // JSON data parsed by `response.json()` call

        if ( data.status === 'SUCCESS' ) {
            console.log('SUCCESS');
            dataValid(data);
        } else { console.log('ERROR');
            dataNotValid(data);
            }
      });

    // function for valid form data
    function dataValid (data = {}) {
        console.log("::: data valid :::")
        document.getElementById('error').classList.add("pseudo");
            document.getElementById('error').innerHTML = "";
            document.getElementById('daysleft').innerHTML = data.daysleft;

            // weather summary and images from APIs
            document.getElementById('weathersummary').innerHTML = data.summary;
            document.getElementById('weathersummary').className = '';
            document.getElementById('weathersummary').classList.add(Client.getIconClass(data.icon));
            document.getElementById('destinationimage').src = data.imagelink;
        }

    // function for invalid form data - show the errors
    function dataNotValid (data = {}) {
        console.log("Data error occured")
        document.getElementById('error').classList.remove("pseudo");
        document.getElementById('error').innerHTML = data.error;
        document.getElementById('weathersummary').className = '';
        document.getElementById('weathersummary').innerHTML = '';
        document.getElementById('destinationimage').src = '';
    }
}

export { handleForm }
