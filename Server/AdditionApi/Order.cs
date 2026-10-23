namespace AdditionApi;

public class Order(int Id, string Item, int Quantity)
{
    public int Id { get; set; } = Id;
    public string Item { get; set; } = Item;
    public int Quantity { get; set; } = Quantity;
}