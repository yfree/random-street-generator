class Map {


    constructor(maxX, maxY) {

        this.theMaxX = maxX;
        this.theMaxY = maxY;

        /* Populated by this.createStreets() */
        this.streets = [];

        /* Populated by this.createStreetCorners() */
        this.streetCorners = [];

        /* These lists are used to prevent streets from overlapping, 
           one street is allowed per point (vertical streets use Y points and horizontal streets use X points) */
        this.usedXPoints = [];
        this.usedYPoints = [];

        this.streetColors = [
            'purple',
            'blue',
            'green',
            'red',
            'orange',
            'yellow',
            'pink',
            'brown',
            'gray',
            'dark-green'
        ];

        this.streetNames = [
            'Monroe',
            'Killigan',
            'New Daisy',
            'Redrick',
            'Culmington',
            'Red Oak',
            'Martial',
            'Pelican',
            'Stafford',
            'New Hemmingway',
            'Charles',
            'Lendin',
            'Black Circle',
            'Mennington',
            'Jefferson',
            'Fadin',
            'Rocker Way',
            'James',
            'Phillips',
            'Colson',
            'Maple Wood',
            'Summerset',
            'New Castle',
            'Jackson',
            'Redford',
            'Gentle Breeze',
            'Village',
            'Executive',
            'Madison',
            'Mason',
            'Red Jar',
            'Nottingdam',
            'Rolls River',
            'Middle Lake',
            'Belyle'
        ];


        this.streetSuffixes = [
            'Street',
            'Avenue',
            'Road',
            'Boulevard',
            'Parkway',
            'Heights'
        ];        
    }


    createMap(){


        this.addGameBoard(); 
        for (var row = 0;row < this.theMaxY;row++){ 

 
            /* Create Game Board Rows */ 
            this.addGameRow(row); 

            /*Create Game Board Cells */ 
            for (var cell = 0;cell < this.theMaxX;cell++){ 
                this.addGameCell(row, cell);        
            }     
        } 

    }

    createStreets(numberOfStreets) {
        var street = {};
        this.streets = [];

        for (var i = 0;i < numberOfStreets;i++){
            street = {};
            street['id'] = i;
            street['name'] = this.generateStreetName();
            street['color'] = this.generateStreetColor();
            street['coordinates'] = this.generateCoordinates();

            this.streets.push(street);
        }   

        this.addStreets(); 
    }


    createMapLegend() {

        var node = document.createElement("div"); 
        node.id = "game-legend"; 
        document.getElementsByTagName("body")[0].appendChild(node); 

        this.streets.forEach(
            street => {

        var node = document.createElement("div"); 
    
        node.className = "game-legend-row"; 

 
        node.innerHTML = '<span class="' + street['color'] + '">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;' + street['name'];
        document.getElementById("game-legend").appendChild(node); 

            }
        );    
    }


    createStreetCorners(){
        this.streetCorners = [];
        var currentNode;
        var count;
        var regex;
        var matches;
        var classString;
        var streetId;
        var node;
        var previewText;
        var streetsAtCorner = [];

    /* First locate the street corners by interating through all of the cells and finding the ones that contain more than one street, 
       these are the points where streets intersect */

        for (var thisY = 0;thisY < this.theMaxY;thisY++){ 

            for (var thisX = 0;thisX < this.theMaxX;thisX++){ 
                currentNode = this.getCellNode(thisX, thisY);
                count = (currentNode.className.match(/street\d/g) || []).length;
                if (count > 1){
                    streetsAtCorner = [];
                    classString = currentNode.className;
                    currentNode.className += ' corner';

                    regex = /street[\d]{1,}/g;
                    matches = Array.from( classString.matchAll(regex) );
                    for (var i = 0;i < matches.length;i++){   
                        streetId = matches[i].toString().replace('street','');
                        streetsAtCorner.push(streetId);
                    }


                    previewText = 'Corner of ' + this.streets[streetsAtCorner[0]]['name'] + ' and ' + this.streets[streetsAtCorner[1]]['name'];
                    node = document.createElement("span"); 
                    node.className = "cornertext"; 
                    node.innerHTML = previewText;
                    currentNode.appendChild(node); 
          
                    this.streetCorners.push(streetsAtCorner);

                }
            }     
        } 

    /* this.streetCorners is now populated with contiguous street corners, each element is an array of the streets that intersect at that corner */

    }


    createStreetCornersLegend(){
        var firstStreet;
        var secondStreet;
        var i = 1;
        var node = document.createElement("div"); 
        node.id = "street-corners-legend"; 
        document.getElementsByTagName("body")[0].appendChild(node); 
	
        this.streetCorners.forEach(

            streetCorner => {
        firstStreet = this.streets[streetCorner[0]]['name'];
        secondStreet = this.streets[streetCorner[1]]['name'];        
        var node = document.createElement("div"); 
            
        node.className = "street-corners-legend-row"; 
        
        /* Every street corner has exactly 2 streets */
        node.innerHTML = 'Intersection ' + i + ' at the corner of ' + firstStreet + ' and ' + secondStreet;
        document.getElementById("street-corners-legend").appendChild(node); 
        i++;
            }
        );   
   
    }

    /* Map Creation Methods */

    addGameBoard(){
        var node = document.createElement("div"); 
        node.id = "game-board"; 
        document.getElementsByTagName("body")[0].appendChild(node); 
    }

    addGameRow(currentRow){ 

        var node = document.createElement("div"); 
    
        node.className = "game-row"; 

 
        node.id = "game-row-" + currentRow; 
        document.getElementById("game-board").appendChild(node); 

        } 

    addGameCell(currentRow, currentCell){ 

        var node = document.createElement("div"); 
        node.className = "game-cell"; 
        node.id = "game-cell-" + currentRow + "-" + currentCell; 

        document.getElementById("game-row-" + currentRow).appendChild(node); 

        } 

/* Array Manipulation Methods */

/* Shuffles the array so that the random selection can be popped off the end and not reused */
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
            [array[i], array[j]] = [array[j], array[i]]; // swap elements
        }
    }

/******************************/

/* Street Creation Methods */

    generateStreetName(){
        var randomSuffixIndex = Math.floor(Math.random() * this.streetSuffixes.length);

        this.shuffle(this.streetNames);
        return this.streetNames.pop() + ' ' + this.streetSuffixes[randomSuffixIndex];
    }
    
    generateStreetColor() {
        this.shuffle(this.streetColors);
        return this.streetColors.pop();
    }
    
    generateCoordinates() {
        var coordinates = [];
        var streetDirection = '';
        var maxLength;
        var randomX;
        var randomY;

        //Random Direction
        var directions = ['vertical','horizontal'];
        var randomNumber = Math.floor(Math.random() * directions.length);

        switch (directions[randomNumber]){
            case 'vertical': streetDirection = 'vertical';break;
            case 'horizontal': streetDirection = 'horizontal';break;
            default:break;
        }

        //Random Length

        if (streetDirection == 'vertical'){
            maxLength = this.theMaxY;
        }
        else {
            maxLength = this.theMaxX;
        }

        var streetLength = Math.floor(Math.random() * (maxLength - 5)) + 5;


        //Random Location

        if (streetDirection == 'vertical'){
            randomY = Math.floor(Math.random() * (this.theMaxY - streetLength));
           
            do {
                randomX = Math.floor(Math.random() * this.theMaxX);
            } 
            while (this.usedXPoints.indexOf(randomX) != -1);
            
            this.usedXPoints.push(randomX);
            this.usedXPoints.push(randomX + 1);
            this.usedXPoints.push(randomX - 1);

            var coordinateY;

            coordinates.push({'x': randomX, 'y': randomY});

            for (var i = 1;i < streetLength;i++){
                coordinateY = randomY + i;
     
                coordinates.push({'x': randomX, 'y': coordinateY});       
            }

        }

        else {
            do {
                var randomY = Math.floor(Math.random() * this.theMaxY);
            }
            while (this.usedYPoints.indexOf(randomY) != -1);

            this.usedYPoints.push(randomY);
            this.usedYPoints.push(randomY + 1);
            this.usedYPoints.push(randomY - 1);

            var randomX = Math.floor(Math.random() * (this.theMaxX - streetLength));
            var coordinateX;

            coordinates.push({'x': randomX, 'y': randomY});

            for (var i = 1;i < streetLength;i++){
                coordinateX = randomX + i;
            
                coordinates.push({'x': coordinateX, 'y': randomY});
            }
        }

        return coordinates;
    }

    /* Constructs the streets that are defined in the member object streets */
    addStreets(){

        for (var street in this.streets){

            for (var coordinateGroup in this.streets[street]['coordinates']){
                this.styleCellStreet(this.streets[street]['coordinates'][coordinateGroup]['x'],
                                     this.streets[street]['coordinates'][coordinateGroup]['y'],
                                     this.streets[street]['id'],
                                     this.streets[street]['color']);   
            }
        }



    }

    styleCellStreet(x, y, streetId, colorOfStreet){
        var node;
        var previewText;    
        var streetNode = document.getElementById("game-cell-" + y + "-" + x);
/* Each street element is branded with the class name street(street_number) and also the color of the street */
        streetNode.className += ' street street' + streetId + ' ' + colorOfStreet; 

                    previewText = this.streets[streetId]['name'];
                    node = document.createElement("span"); 
                    node.className = "streettext"; 
                    node.innerHTML = previewText;
                    streetNode.appendChild(node); 
          



    }
 
/***************************/

    getCellNode(thePosX, thePosY){

        //Y comes before X in the cell id name for readability, I use the standard X, Y for everything else
        var node = document.getElementById("game-cell-" + thePosY + "-" + thePosX);

        return node;

    }    



}