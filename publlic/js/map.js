  <script>
    let mapToken ="<%=process.env.MAP_TOKEN %>";
    console.log(mapToken);
    mapboxgl.accessToken =mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: [77.216721,28.644800], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });
</script>