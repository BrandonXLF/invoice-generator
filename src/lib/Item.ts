export default class Item {
	desc = '';
	quantity = 0;
	rate = 0;

	get amount() {
		return this.quantity * this.rate;
	}
}
