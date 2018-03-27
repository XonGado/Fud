document.onready = function(){
	var gen_items = [];

	gen_items.push(createItem('0', 'ChocoChip', 'samplePP.jpg', 'This is a Choco Chip waffle', '60', 'waffle'));

	console.log(gen_items);
}

order.controller("orderController", function($scope) {
    $scope.items = gen_items;

    console.log(items);
});

function createItem(p_id, p_name, p_url, p_description, p_price, p_type){
	var item = {
		id: p_id, 
		name: p_name, 
		image: p_url, 
		description: p_description, 
		price: p_price, 
		type: p_type
	};

	return item;
}