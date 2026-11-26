// import React, { useEffect, useMemo, useState } from "react";
// import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import * as hractions from "./_redux/hrActions";

// export default function CreateSales({ onHide }) {
//   const dispatch = useDispatch();

//   // =========================
//   // STATES
//   // =========================

//   const [outletId, setOutletId] = useState("");

//   const [saleDate, setSaleDate] = useState(() => {
//     const date = new Date();
//     return [
//       date.getFullYear(),
//       String(date.getMonth() + 1).padStart(2, "0"),
//       String(date.getDate()).padStart(2, "0"),
//     ].join("-");
//   });

//   const [paymentMethod, setPaymentMethod] = useState("cash");
//   const [items, setItems] = useState([]);

//   const [selectedMenuItemId, setSelectedMenuItemId] = useState("");
//   const [quantity, setQuantity] = useState("1");
//   const [sellingPrice, setSellingPrice] = useState("");

//   const [submitting, setSubmitting] = useState(false);

//   // =========================
//   // REDUX DATA
//   // =========================

//   const { inventories, outletList } = useSelector((state) => ({
//     inventories: state.hr.inventories || [],
//     outletList: state.hr.outletList || [],
//   }));

//   // =========================
//   // INITIAL DATA
//   // =========================

//   useEffect(() => {
//     dispatch(hractions.getInventories());
//     dispatch(hractions.getOutletList());
//   }, [dispatch]);

//   // =========================
//   // FILTER OUTLET INVENTORIES
//   // =========================

//   const outletInventories = useMemo(() => {
//     if (!outletId) return [];

//     return inventories.filter(
//       (item) =>
//         Number(item.outlet_id) === Number(outletId) && item.is_active !== false,
//     );
//   }, [inventories, outletId]);

//   // =========================
//   // GET MENU ITEMS FROM OUTLET MENUS
//   // =========================

//   const menuItemOptions = useMemo(() => {
//     const menuMap = new Map();

//     outletInventories.forEach((inventory) => {
//       (inventory.outlet_menus || []).forEach((outletMenu) => {
//         // Ignore unavailable menus
//         if (outletMenu.is_available === false) return;

//         const menuItemId = outletMenu.menu_item_id || outletMenu.menu_item?.id;

//         if (!menuItemId) return;

//         // Avoid duplicate menu items
//         if (!menuMap.has(Number(menuItemId))) {
//           menuMap.set(Number(menuItemId), {
//             outlet_menu_id: outletMenu.id,
//             menu_item_id: Number(menuItemId),
//             name: outletMenu.menu_item?.name || "Unnamed Menu",
//             selling_price: Number(outletMenu.selling_price || 0),
//           });
//         }
//       });
//     });

//     return Array.from(menuMap.values());
//   }, [outletInventories]);

//   // =========================
//   // SELECTED MENU
//   // =========================

//   const selectedMenu = useMemo(() => {
//     return menuItemOptions.find(
//       (item) => Number(item.menu_item_id) === Number(selectedMenuItemId),
//     );
//   }, [menuItemOptions, selectedMenuItemId]);

//   // =========================
//   // SUBTOTAL
//   // =========================

//   const subtotal = useMemo(() => {
//     return items.reduce(
//       (sum, item) => sum + Number(item.quantity) * Number(item.selling_price),
//       0,
//     );
//   }, [items]);

//   // =========================
//   // OUTLET CHANGE
//   // =========================

//   const handleOutletChange = (value) => {
//     setOutletId(value);

//     setSelectedMenuItemId("");
//     setQuantity("1");
//     setSellingPrice("");
//     setItems([]);
//   };

//   // =========================
//   // MENU CHANGE
//   // =========================

//   const handleMenuItemChange = (value) => {
//     setSelectedMenuItemId(value);

//     const menu = menuItemOptions.find(
//       (item) => Number(item.menu_item_id) === Number(value),
//     );

//     setQuantity("1");
//     setSellingPrice(menu ? String(menu.selling_price) : "");
//   };

//   // =========================
//   // ADD SALE ITEM
//   // =========================

//   const handleAddItem = () => {
//     if (!outletId) {
//       alert("Please select outlet");
//       return;
//     }

//     if (!selectedMenu) {
//       alert("Please select menu item");
//       return;
//     }

//     const qty = Number(quantity);
//     const price = Number(sellingPrice);

//     if (!Number.isFinite(qty) || qty <= 0) {
//       alert("Please enter a valid quantity");
//       return;
//     }

//     if (!Number.isFinite(price) || price <= 0) {
//       alert("Please enter a valid selling price");
//       return;
//     }

//     const menuItemId = Number(selectedMenu.menu_item_id);

//     const existing = items.find(
//       (item) => Number(item.menu_item_id) === menuItemId,
//     );

//     let updatedItems;

//     if (existing) {
//       updatedItems = items.map((item) => {
//         if (Number(item.menu_item_id) !== menuItemId) {
//           return item;
//         }

//         const updatedQuantity = Number(item.quantity) + qty;

//         return {
//           ...item,
//           quantity: updatedQuantity,
//           total: updatedQuantity * Number(item.selling_price),
//         };
//       });
//     } else {
//       updatedItems = [
//         ...items,
//         {
//           menu_item_id: menuItemId,
//           name: selectedMenu.name,
//           quantity: qty,
//           selling_price: price,
//           total: qty * price,
//         },
//       ];
//     }

//     setItems(updatedItems);

//     setSelectedMenuItemId("");
//     setQuantity("1");
//     setSellingPrice("");
//   };

//   // =========================
//   // REMOVE SALE ITEM
//   // =========================

//   const handleRemoveItem = (menuItemId) => {
//     setItems((prev) =>
//       prev.filter((item) => Number(item.menu_item_id) !== Number(menuItemId)),
//     );
//   };

//   // =========================
//   // SUBMIT SALE
//   // =========================

//   const handleSubmit = async () => {
//     if (!outletId) {
//       alert("Please select outlet");
//       return;
//     }

//     if (!saleDate) {
//       alert("Please select sale date");
//       return;
//     }

//     if (!items.length) {
//       alert("Please add at least one item");
//       return;
//     }

//     const payload = {
//       outlet_id: Number(outletId),
//       sale_date: saleDate,
//       payment_method: paymentMethod,

//       items: items.map((item) => ({
//         menu_item_id: Number(item.menu_item_id),
//         quantity: Number(item.quantity),
//         unit_price: Number(item.selling_price.toFixed(2)),
//         discount_amount: 0,
//       })),
//     };

//     try {
//       setSubmitting(true);

//       const result = await dispatch(hractions.createSale(payload));

//       if (result?.meta?.requestStatus === "rejected") {
//         throw new Error(result.error?.message || "Sale creation failed");
//       }

//       alert("Sale created successfully");

//       onHide?.();
//     } catch (error) {
//       console.error("Sale creation failed:", error);

//       alert(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Failed to create sale",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // =========================
//   // RENDER
//   // =========================

//   return (
//     <Card>
//       <Card.Header>
//         <h5 className="mb-0">Create Sale</h5>
//       </Card.Header>

//       <Card.Body>
//         {/* SALE INFORMATION */}

//         <Row className="mb-4">
//           <Col md={4}>
//             <Form.Group>
//               <Form.Label>Outlet</Form.Label>

//               <Form.Select
//                 value={outletId}
//                 onChange={(e) => handleOutletChange(e.target.value)}
//                 className="form-control"
//               >
//                 <option value="">Select Outlet</option>

//                 {outletList.map((outlet) => (
//                   <option key={outlet.id} value={outlet.id}>
//                     {outlet.name}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>

//           <Col md={4}>
//             <Form.Group>
//               <Form.Label>Sale Date</Form.Label>

//               <Form.Control
//                 type="date"
//                 value={saleDate}
//                 onChange={(e) => setSaleDate(e.target.value)}
//               />
//             </Form.Group>
//           </Col>

//           <Col md={4}>
//             <Form.Group>
//               <Form.Label>Payment Method</Form.Label>

//               <Form.Select
//                 value={paymentMethod}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="form-control"
//               >
//                 <option value="CASH">Cash</option>
//                 <option value="CARD">Card</option>
//                 <option value="MOBILE_BANKING">Mobile Banking</option>
//               </Form.Select>
//             </Form.Group>
//           </Col>
//         </Row>

//         {/* ADD SALE ITEM */}

//         <Card className="mb-4">
//           <Card.Header>
//             <strong>Add Sale Item</strong>
//           </Card.Header>

//           <Card.Body>
//             <Row className="align-items-end">
//               <Col md={4}>
//                 <Form.Group>
//                   <Form.Label>Menu Item</Form.Label>

//                   <Form.Select
//                     value={selectedMenuItemId}
//                     onChange={(e) => handleMenuItemChange(e.target.value)}
//                     disabled={!outletId}
//                     className="form-control"
//                   >
//                     <option value="">Select Menu Item</option>

//                     {menuItemOptions.map((menu) => (
//                       <option key={menu.menu_item_id} value={menu.menu_item_id}>
//                         {menu.name} - {menu.selling_price.toFixed(2)}
//                       </option>
//                     ))}
//                   </Form.Select>

//                   {outletId && !menuItemOptions.length && (
//                     <Form.Text className="text-danger">
//                       No available menu items found for this outlet.
//                     </Form.Text>
//                   )}
//                 </Form.Group>
//               </Col>

//               <Col md={2}>
//                 <Form.Group>
//                   <Form.Label>Quantity</Form.Label>

//                   <Form.Control
//                     type="number"
//                     min="0.001"
//                     step="0.001"
//                     value={quantity}
//                     onChange={(e) => setQuantity(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label>Selling Price</Form.Label>

//                   <Form.Control
//                     type="number"
//                     min="0.01"
//                     step="0.01"
//                     value={sellingPrice}
//                     onChange={(e) => setSellingPrice(e.target.value)}
//                     placeholder="Selling Price"
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Button
//                   variant="primary"
//                   className="w-100"
//                   onClick={handleAddItem}
//                   disabled={!selectedMenu}
//                 >
//                   Add Item
//                 </Button>
//               </Col>
//             </Row>
//           </Card.Body>
//         </Card>

//         {/* SALE ITEMS TABLE */}

//         <Table responsive bordered hover>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Menu Item</th>
//               <th>Menu ID</th>
//               <th>Quantity</th>
//               <th>Price</th>
//               <th>Total</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {items.map((item, index) => (
//               <tr key={item.menu_item_id}>
//                 <td>{index + 1}</td>
//                 <td>{item.name}</td>
//                 <td>{item.menu_item_id}</td>
//                 <td>{item.quantity}</td>
//                 <td>{Number(item.selling_price).toFixed(2)}</td>
//                 <td>{Number(item.total).toFixed(2)}</td>

//                 <td>
//                   <Button
//                     size="sm"
//                     variant="danger"
//                     onClick={() => handleRemoveItem(item.menu_item_id)}
//                   >
//                     Remove
//                   </Button>
//                 </td>
//               </tr>
//             ))}

//             {!items.length && (
//               <tr>
//                 <td colSpan="7" className="text-center">
//                   No items added
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>

//         {/* SALE SUMMARY */}

//         <Row className="justify-content-end">
//           <Col md={4}>
//             <Card className="bg-light">
//               <Card.Body>
//                 <h5 className="d-flex justify-content-between">
//                   <span>Subtotal:</span>
//                   <span>{subtotal.toFixed(2)}</span>
//                 </h5>

//                 <hr />

//                 <h4 className="d-flex justify-content-between">
//                   <span>Total:</span>
//                   <span>{subtotal.toFixed(2)}</span>
//                 </h4>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* ACTIONS */}

//         <div className="d-flex justify-content-end mt-4">
//           <Button
//             variant="secondary"
//             className="me-2"
//             onClick={onHide}
//             disabled={submitting}
//           >
//             Cancel
//           </Button>

//           <Button
//             variant="success"
//             onClick={handleSubmit}
//             disabled={!items.length || submitting}
//           >
//             {submitting ? "Saving..." : "Save Sale"}
//           </Button>
//         </div>
//       </Card.Body>
//     </Card>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as hractions from "./_redux/hrActions";
import { swalError, swalSuccess, swalWarning } from "../../helpers/swal";

export default function CreateSales({ onHide }) {
  const dispatch = useDispatch();

  // =========================
  // STATES
  // =========================

  const [outletId, setOutletId] = useState("");

  const [saleDate, setSaleDate] = useState(() => {
    const date = new Date();
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  });

  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [items, setItems] = useState([]);

  const [selectedMenuItemId, setSelectedMenuItemId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [sellingPrice, setSellingPrice] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // =========================
  // REDUX DATA
  // =========================

  const { inventories, outletList } = useSelector((state) => ({
    inventories: state.hr.inventories || [],
    outletList: state.hr.outletList || [],
  }));

  // =========================
  // INITIAL DATA
  // =========================

  useEffect(() => {
    dispatch(hractions.getInventories());
    dispatch(hractions.getOutletList());
  }, [dispatch]);

  // =========================
  // OUTLET INVENTORIES
  // =========================

  const outletInventories = useMemo(() => {
    if (!outletId) return [];

    return inventories.filter(
      (inventory) =>
        Number(inventory.outlet_id) === Number(outletId) &&
        inventory.is_active !== false,
    );
  }, [inventories, outletId]);

  // =========================
  // AVAILABLE STOCK BY MENU ITEM
  // =========================

  const getAvailableStock = (menuItemId) => {
    const inventory = outletInventories.find((item) => {
      return (item?.outlet_menus || []).some(
        (menu) => Number(menu?.menu_item_id) === menuItemId,
      );
    });
    if (!inventory) return 0;

    return Math.max(
      0,
      Number(inventory.quantity || 0) -
        Number(inventory.reserved_quantity || 0),
    );
  };

  // =========================
  // MENU ITEM OPTIONS
  // =========================

  const menuItemOptions = useMemo(() => {
    const menuMap = new Map();

    outletInventories.forEach((inventory) => {
      // Get menu information from inventory or outlet association
      const outletMenus =
        inventory.outlet_menus || inventory.outlet?.outlet_menus || [];

      outletMenus.forEach((outletMenu) => {
        if (outletMenu.is_available === false) return;

        const menuItemId = Number(
          outletMenu.menu_item_id || outletMenu.menu_item?.id,
        );

        if (!menuItemId) return;

        const stock = outletInventories.find((item) => {
          return (item?.outlet_menus || []).some(
            (menu) => Number(menu?.menu_item_id) === menuItemId,
          );
        });
        console.log({ stock });
        // Menu item must have an inventory record
        if (!stock) return;

        const available =
          Number(stock.quantity || 0) - Number(stock.reserved_quantity || 0);

        if (!menuMap.has(menuItemId)) {
          menuMap.set(menuItemId, {
            outlet_menu_id: outletMenu.id,
            menu_item_id: menuItemId,
            name: outletMenu.menu_item?.name || "Unnamed Menu",
            selling_price: Number(outletMenu.selling_price || 0),
            available_quantity: Math.max(0, available),
            inventory_id: stock.id,
          });
        }
      });
    });

    return Array.from(menuMap.values());
  }, [outletInventories]);

  // =========================
  // SELECTED MENU
  // =========================

  const selectedMenu = useMemo(() => {
    return menuItemOptions.find(
      (item) => Number(item.menu_item_id) === Number(selectedMenuItemId),
    );
  }, [menuItemOptions, selectedMenuItemId]);

  // =========================
  // ALREADY ADDED QUANTITY
  // =========================

  const alreadyAddedQuantity = useMemo(() => {
    const existing = items.find(
      (item) => Number(item.menu_item_id) === Number(selectedMenuItemId),
    );

    return Number(existing?.quantity || 0);
  }, [items, selectedMenuItemId]);

  // =========================
  // REMAINING STOCK
  // =========================

  const remainingStock = selectedMenu
    ? Math.max(0, selectedMenu.available_quantity - alreadyAddedQuantity)
    : 0;

  // =========================
  // SUBTOTAL
  // =========================

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.selling_price),
      0,
    );
  }, [items]);

  // =========================
  // OUTLET CHANGE
  // =========================

  const handleOutletChange = (value) => {
    setOutletId(value);

    setSelectedMenuItemId("");
    setQuantity("1");
    setSellingPrice("");
    setItems([]);
  };

  // =========================
  // MENU CHANGE
  // =========================

  const handleMenuItemChange = (value) => {
    setSelectedMenuItemId(value);

    const menu = menuItemOptions.find(
      (item) => Number(item.menu_item_id) === Number(value),
    );

    setQuantity("1");
    setSellingPrice(menu ? String(menu.selling_price) : "");
  };

  // =========================
  // QUANTITY CHANGE
  // =========================

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  // =========================
  // ADD SALE ITEM
  // =========================

  const handleAddItem = () => {
    if (!outletId) {
      swalWarning("Please select outlet");
      return;
    }

    if (!selectedMenu) {
      swalWarning("Please select menu item");
      return;
    }

    const qty = Number(quantity);
    const price = Number(sellingPrice);

    if (!Number.isFinite(qty) || qty <= 0) {
      swalWarning("Please enter a valid quantity");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      swalWarning("Please enter a valid selling price");
      return;
    }

    const availableStock = getAvailableStock(selectedMenu.menu_item_id);
    console.log({ availableStock });
    const existing = items.find(
      (item) => Number(item.menu_item_id) === Number(selectedMenu.menu_item_id),
    );
    console.log({ selectedMenu });
    const currentQuantity = Number(existing?.quantity || 0);

    const totalRequestedQuantity = currentQuantity + qty;

    // Validate combined quantity
    if (totalRequestedQuantity > availableStock) {
      swalWarning(
        `Insufficient inventory!\n\n` +
          `Available stock: ${availableStock.toFixed(3)}\n` +
          `Already added: ${currentQuantity.toFixed(3)}\n` +
          `Remaining stock: ${Math.max(
            0,
            availableStock - currentQuantity,
          ).toFixed(3)}`,
      );
      return;
    }

    let updatedItems;

    if (existing) {
      updatedItems = items.map((item) => {
        if (Number(item.menu_item_id) !== Number(selectedMenu.menu_item_id)) {
          return item;
        }

        return {
          ...item,
          quantity: totalRequestedQuantity,
          selling_price: price,
          total: totalRequestedQuantity * price,
        };
      });
    } else {
      updatedItems = [
        ...items,
        {
          menu_item_id: Number(selectedMenu.menu_item_id),
          inventory_id: selectedMenu.inventory_id,
          name: selectedMenu.name,
          quantity: qty,
          selling_price: price,
          available_quantity: availableStock,
          total: qty * price,
        },
      ];
    }

    setItems(updatedItems);

    setSelectedMenuItemId("");
    setQuantity("1");
    setSellingPrice("");
  };

  // =========================
  // REMOVE SALE ITEM
  // =========================

  const handleRemoveItem = (menuItemId) => {
    setItems((prev) =>
      prev.filter((item) => Number(item.menu_item_id) !== Number(menuItemId)),
    );
  };

  // =========================
  // SUBMIT VALIDATION
  // =========================

  const validateInventory = () => {
    for (const item of items) {
      const availableStock = getAvailableStock(item.menu_item_id);

      if (Number(item.quantity) > availableStock) {
        swalWarning(
          `Insufficient stock for ${item.name}.\n` +
            `Available: ${availableStock.toFixed(3)}\n` +
            `Requested: ${Number(item.quantity).toFixed(3)}`,
        );

        return false;
      }
    }

    return true;
  };

  // =========================
  // SUBMIT SALE
  // =========================

  const handleSubmit = async () => {
    if (!outletId) {
      swalWarning("Please select outlet");
      return;
    }

    if (!saleDate) {
      swalWarning("Please select sale date");
      return;
    }

    if (!items.length) {
      swalWarning("Please add at least one item");
      return;
    }

    if (!validateInventory()) {
      return;
    }

    const payload = {
      outlet_id: Number(outletId),
      sale_date: saleDate,
      payment_method: paymentMethod,

      items: items.map((item) => ({
        menu_item_id: Number(item.menu_item_id),
        quantity: Number(item.quantity),
        unit_price: Number(item.selling_price.toFixed(2)),
        discount_amount: 0,
      })),
    };

    try {
      setSubmitting(true);

      const result = await dispatch(hractions.createSale(payload));

      if (result?.meta?.requestStatus === "rejected") {
        throw new Error(result.error?.message || "Sale creation failed");
      }

      swalSuccess("Sale created successfully");

      onHide?.();
    } catch (error) {
      console.error("Sale creation failed:", error);

      swalWarning(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create sale",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // RENDER
  // =========================

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Create Sale</h5>
      </Card.Header>

      <Card.Body>
        {/* SALE INFORMATION */}

        <Row className="mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Outlet</Form.Label>

              <Form.Select
                value={outletId}
                onChange={(e) => handleOutletChange(e.target.value)}
                className="form-control"
              >
                <option value="">Select Outlet</option>

                {outletList.map((outlet) => (
                  <option key={outlet.id} value={outlet.id}>
                    {outlet.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Sale Date</Form.Label>

              <Form.Control
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Payment Method</Form.Label>

              <Form.Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-control"
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="MOBILE_BANKING">Mobile Banking</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* ADD SALE ITEM */}

        <Card className="mb-4">
          <Card.Header>
            <strong>Add Sale Item</strong>
          </Card.Header>

          <Card.Body>
            <Row className="align-items-end">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Menu Item</Form.Label>

                  <Form.Select
                    value={selectedMenuItemId}
                    onChange={(e) => handleMenuItemChange(e.target.value)}
                    disabled={!outletId}
                    className="form-control"
                  >
                    <option value="">Select Menu Item</option>

                    {menuItemOptions.map((menu) => (
                      <option
                        key={menu.menu_item_id}
                        value={menu.menu_item_id}
                        disabled={menu.available_quantity <= 0}
                      >
                        {menu.name} - {menu.selling_price.toFixed(2)}
                        {" | Stock: "}
                        {menu.available_quantity.toFixed(3)}
                      </option>
                    ))}
                  </Form.Select>

                  {outletId && !menuItemOptions.length && (
                    <Form.Text className="text-danger">
                      No menu items linked with inventory.
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label>Quantity</Form.Label>

                  <Form.Control
                    type="number"
                    min="0.001"
                    max={remainingStock}
                    step="0.001"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    disabled={!selectedMenu}
                  />

                  {selectedMenu && (
                    <Form.Text
                      className={
                        Number(quantity) > remainingStock
                          ? "text-danger"
                          : "text-success"
                      }
                    >
                      Remaining: {remainingStock.toFixed(3)}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Selling Price</Form.Label>

                  <Form.Control
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="Selling Price"
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={handleAddItem}
                  disabled={
                    !selectedMenu ||
                    remainingStock <= 0 ||
                    Number(quantity) <= 0 ||
                    Number(quantity) > remainingStock
                  }
                >
                  Add Item
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* SALE ITEMS TABLE */}

        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Menu Item</th>
              <th>Menu ID</th>
              <th>Available Stock</th>
              <th>Sale Quantity</th>
              <th>Remaining</th>
              <th>Price</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => {
              const currentStock = getAvailableStock(item.menu_item_id);

              const remaining = currentStock - Number(item.quantity);

              return (
                <tr key={item.menu_item_id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.menu_item_id}</td>

                  <td>{currentStock.toFixed(3)}</td>

                  <td>{Number(item.quantity).toFixed(3)}</td>

                  <td>
                    <span
                      className={remaining < 0 ? "text-danger" : "text-success"}
                    >
                      {remaining.toFixed(3)}
                    </span>
                  </td>

                  <td>{Number(item.selling_price).toFixed(2)}</td>

                  <td>{Number(item.total).toFixed(2)}</td>

                  <td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleRemoveItem(item.menu_item_id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              );
            })}

            {!items.length && (
              <tr>
                <td colSpan="9" className="text-center">
                  No items added
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* SALE SUMMARY */}

        <Row className="justify-content-end">
          <Col md={4}>
            <Card className="bg-light">
              <Card.Body>
                <h5 className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>{subtotal.toFixed(2)}</span>
                </h5>

                <hr />

                <h4 className="d-flex justify-content-between">
                  <span>Total:</span>
                  <span>{subtotal.toFixed(2)}</span>
                </h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ACTIONS */}

        <div className="d-flex justify-content-end mt-4">
          <Button
            variant="secondary"
            className="me-2"
            onClick={onHide}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            variant="success"
            onClick={handleSubmit}
            disabled={!items.length || submitting}
          >
            {submitting ? "Saving..." : "Save Sale"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
