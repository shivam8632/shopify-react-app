import React, {useState, useEffect, useContext} from 'react';
import UserContext from '../context/UserContext';
import './pages.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API } from '../../config/Api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faSearch } from '@fortawesome/free-solid-svg-icons';

const CreateCampaign = () => {
    const [productName, setProductName] = useState([]);
    const [productIds, setProductIds] = useState([]);
    const [influencerList, setInfluencerList] = useState([]);
    const [campaignName, setCampaignName] = useState('');
    const [selectedDate, setSelectedDate] = useState("");
    const [endDate, setEndDate] = useState('');
    const [influencerVisit, setInfluencerVisit] = useState('');
    const [userData, setUserData] = useState([]);
    const [showList, setShowList] = useState(false);
    const [campaignDesc, setCampaignDesc] = useState('');
    const [influenceOffer, setInfluenceOffer] = useState('');
    const [selectedCoupon, setSelectedCoupon] = useState({ coupon_name: "", product: "" });
    const [prodList, setProdList] = useState('')
    const [loading, setLoading] = useState(false);
    const [productUrl, setProductUrl] = useState([]);
    const [marketCoupons, setMarketCoupns] = useState([])
    const [showInfluencerDropdown, setShowInfluencerDropdown] = useState(false);
    const [selectedInfluencer, setSelectedInfluencer] = useState([]);
    const [selectedCoupons, setSelectedCoupons] = useState([]);
    const [influenceFee, setInfluenceFee] = useState('');
    const [prevCouponClicked, setPrevCouponClicked] = useState('');
    const [couponClicked, setCouponClicked] = useState('');
    const [selectedCouponNames, setSelectedCouponNames] = useState([]);
    const [selectedCouponAmounts, setSelectedCouponAmounts] = useState([]);
    const [isVisitChecked, setIsVisitChecked] = useState(false);
    const [isOfferChecked, setIsOfferChecked] = useState(false);
    const [initialCoupons, setInitialCoupons] = useState([]);
    const { setMarketId, setMarketList,setMarketDraftId, setMarketDraftList, countCamp, setCountCamp} = useContext(UserContext);
    const token = localStorage.getItem("Token");
    const [productDetails, setProductDetails] = useState([]);
    const [selectedProd, setSelectedProd] = useState([])
  
    const today = new Date().toISOString().substr(0, 10);
    const navigate = useNavigate();
    const {id} = useParams();

    const handleCampDesc = (event) => {
        setCampaignDesc(event.target.value);
    }

    const handleCampaignNameChange = (event) => {
        setCampaignName(event.target.value);
    }

    const handleInfluencerVisit = (event) => {
        setInfluencerVisit(event.target.value);
        setIsVisitChecked(!isVisitChecked)
    }

    const handleInfluencerSelection = (influencer) => {
        setSelectedInfluencer(influencer);
        setShowInfluencerDropdown(false);
    };

    const handleInfluenceOffer = (e) => {
        setInfluenceOffer(e.target.value);
        setIsOfferChecked(!isOfferChecked)
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    }

    const handleEndDate = (event) => {
        setEndDate(event.target.value);
    }

    useEffect(() => {
        axios.get(API.BASE_URL + 'product/list/',{
            headers: {
                Authorization: `Token 43272d3b1eb9b1f7beed87ee636d1079483a41ad`
            }
        })
        .then(function (response) {
            console.log("Product List", response);
            setProdList(response.data.success.products)
        })
        .catch(function (error) {
            console.log(error);
        })

        axios.get(API.BASE_URL + 'influencer/list/',{
            headers: {
                Authorization: `Token 43272d3b1eb9b1f7beed87ee636d1079483a41ad`
            }
        })
        .then(function (response) {
            console.log("Influencer List", response.data.data);
            setInfluencerList(response.data.data)
        })
        .catch(function (error) {
            console.log(error);
        })
    }, [token])

    const countList = () => {
        axios.get(API.BASE_URL + 'count/',{
            headers: {
                Authorization: 'Token ' + localStorage.getItem('Token')
            }
        })
        .then(function (response) {
            console.log("Count List in New", response);
            setCountCamp(response.data);
            console.log(countCamp)
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    
    const createNewCampaignDraft = (e) => {  
        setLoading(true);
        e.preventDefault();
        axios.post(API.BASE_URL + 'create/', {
            product: productIds,
            campaign_name: campaignName,
            date: selectedDate,
            coupon: selectedCouponNames.toString(),
            offer: influenceOffer,
            product_name: productName,
            product_discount: selectedProd,
            influencer_visit: influencerVisit,
            influencer_fee: influenceFee,
            description: campaignDesc,
            end_date: endDate
        }, {
            headers: {
                Authorization: `Token 43272d3b1eb9b1f7beed87ee636d1079483a41ad`
            }
        })
        .then(function (response) {
            console.log("Campaign Saved in Draft", response);
            toast.success("Campaign Saved in Draft!", { autoClose: 1000 });
            setProductName([]);
            setCampaignName('');
            setSelectedDate('');
            setInfluenceOffer('');
            setInfluencerVisit('');
            setCampaignDesc('')
            setProductIds([]);
            setSelectedCoupon('')
            setProductDetails([])
            setProductUrl([])
            setSelectedCoupons([])
            countList()
            setIsVisitChecked(false);
            setIsOfferChecked(false);
            navigate('/market')
        })
        .catch(function (error) {
            console.log(error);
            if(error.response.data.campaign_name) {
                toast.warn("Campaign Name may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.influencer_visit) {
                toast.warn("Influencer Visit may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.date) {
                toast.warn("Date may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.offer) {
                toast.warn("Offer may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.product) {
                toast.warn("Please selecta any Product.", { autoClose: 1000 });
            }
            else if(error.response.data.influencer_fee == "Influencer fee must be in positive.") {
                toast.warn("Influencer fee must be in positive.", { autoClose: 1000 });
            }
            else if(error.response.data.influencer_fee) {
                toast.warn("Please add a fee for Influencer.", { autoClose: 1000 });
            }
            else if(error.response.data.product_discount) {
                toast.warn("Please select any value of Product Discount.", { autoClose: 1000 });
            }
            else if(error.response.data.error == "Product field may not be blank.") {
                toast.warn("Product field may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.error == "Coupon field may not be blank.") {
                toast.warn("Coupon field may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.coupon) {
                toast.warn("Coupon may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.error) {
                toast.warn(`Campaign with ${error.response.data.error[0]} already exists`, { autoClose: 1000 });
            }
            else if(error.response.data.description) {
                toast.warn("Description may not be blank.", { autoClose: 1000 });
            }
            
            else {
                toast.warn("Request failed. Please try again later", { autoClose: 1000 });
            }
        })
        .finally(() => setLoading(false));
    }

    const createNewCampaign = (e) => {  
        setLoading(true);
        e.preventDefault();
        axios.post(API.BASE_URL + 'markplace/camp', {
            product: productIds,
            campaign_name: campaignName,
            date: selectedDate,
            coupon: selectedCouponNames.toString(),
            offer: influenceOffer,
            product_discount: selectedProd,
            product_name: productName,
            influencer_fee: influenceFee,
            influencer_visit: influencerVisit,
            description: campaignDesc,
            end_date: endDate
        }, {
            headers: {
                Authorization: `Token 43272d3b1eb9b1f7beed87ee636d1079483a41ad`
            }
        })
        .then(function (response) {
            console.log("Created New Campaign", response);
            toast.success("New Campaign Created!", { autoClose: 1000 });
            setProductName([]);
            setCampaignName('');
            setSelectedDate('');
            setInfluenceOffer('');
            setInfluencerVisit('');
            setProductIds([])
            setCampaignDesc('');
            setSelectedCoupons([])
            setSelectedCoupon('')
            setProductDetails([])
            setIsVisitChecked(false);
            setIsOfferChecked(false);
            countList()
            navigate('/market')
        })
        .catch(function (error) {
            console.log(error);
            if(error.response.data.campaign_name) {
                toast.warn("Campaign Name may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.influencer_visit) {
                toast.warn("Influencer Visit may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.date) {
                toast.warn("Date may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.offer) {
                toast.warn("Offer may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.product) {
                toast.warn("Please selecta any Product.", { autoClose: 1000 });
            }
            else if(error.response.data.influencer_fee == "Influencer fee must be in positive.") {
                toast.warn("Influencer fee must be in positive.", { autoClose: 1000 });
            }
            else if(error.response.data.influencer_fee) {
                toast.warn("Please add a fee for Influencer.", { autoClose: 1000 });
            }
            else if(error.response.data.product_discount) {
                toast.warn("Please select any value of Product Discount.", { autoClose: 1000 });
            }
            else if(error.response.data.error == "Product field may not be blank.") {
                toast.warn("Product field may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.error == "Coupon field may not be blank.") {
                toast.warn("Coupon field may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.coupon) {
                toast.warn("Coupon may not be blank.", { autoClose: 1000 });
            }
            else if(error.response.data.error) {
                toast.warn(`Campaign with ${error.response.data.error[0]} already exists`, { autoClose: 1000 });
            }
            else if(error.response.data.description) {
                toast.warn("Description may not be blank.", { autoClose: 1000 });
            }
            else {
                toast.warn("Request failed. Please try again later", { autoClose: 1000 });
            }
        })
        .finally(() => setLoading(false));
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
          document.removeEventListener("click", handleClickOutside);
        };
    }, [token]);

    const handleClickOutside = (event) => {
        const input = document.querySelector(".test input");
        const list = document.querySelector(".test ul");
        if (!input?.contains(event.target) && !list?.contains(event.target)) {
          setShowList(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutsideCoupon);
        return () => {
          document.removeEventListener("click", handleClickOutsideCoupon);
        };
    }, [token]);

    const handleClickOutsideCoupon = (event) => {
        const input = document.querySelector(".coup input");
        const list = document.querySelector(".coup ul");
        if (!input?.contains(event.target) && !list?.contains(event.target)) {
          setShowInfluencerDropdown(false);
        }
    };

    useEffect(() => {
        if (Array.isArray(productName)) {
          Promise.all(
            productName?.map((product) => {
              setLoading(true);
              return axios
                .post(API.BASE_URL + "product/url/", {
                  products: productIds.filter(Boolean).toString()
                }, {
                  headers: {
                    Authorization: `Token 43272d3b1eb9b1f7beed87ee636d1079483a41ad`,
                  },
                })
                .then((response) => {
                  console.log("Response 1",response);
                  setProductUrl(response.data.product_url)
                })
                .catch((error) => console.log(error))
                .finally(() => setLoading(false));
            })
          ).finally(() => setLoading(false));
        }
    }, [productName, productIds, token]);

    useEffect(() => {
        setLoading(true);
        axios.get(API.SHOPIFY_URL + "coupons/", {
            headers: {
            Authorization: `Token 43272d3b1eb9b1f7beed87ee636d1079483a41ad`,
            },
        })
        .then((response) => {
            console.log("Marketplace Coupons",response);
            setMarketCoupns(response.data)
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }, [productName, productIds, token]);

    useEffect(() => {
        setPrevCouponClicked(couponClicked);
    }, [couponClicked, selectedCoupon]);

    const editCampaign = (event) => {
        console.log("Product ID:");
        event.preventDefault();
        setLoading(true);
        axios.put(API.BASE_URL + 'update/' + id + '/',{
            campaign_name: campaignName,
            description: campaignDesc,
            offer: influenceOffer,
            product_discount: selectedProd,
            influencer_fee: influenceFee,
            date: selectedDate,
            product_name: productName,
            end_date: endDate
          },{
          headers: {
            Authorization: `Token 43272d3b1eb9b1f7beed87ee636d1079483a41ad`
          }
        })
        .then(function (response) {
          console.log("EDITED MARKET", response)
          toast.success("Campaign Edited Successfully", { autoClose: 1000 });
          navigate('/market')
        })
        .catch(function (error) {
          console.log(error);
          if(error.response.data.influencer_fee == "Influencer fee must be in positive.") {
              toast.warn("Influencer fee must be in positive.", { autoClose: 1000 })
          }
          toast.warn("Unable to edit. Please try again later", { autoClose: 1000 })
        })
        .finally(() => setLoading(false));
    }

    useEffect(() => {
        if(id?.length > 0) {
            axios.get(API.BASE_URL +  'single/' + id + '/', {
                headers: {
                    Authorization: `Token 43272d3b1eb9b1f7beed87ee636d1079483a41ad`
            }})
            .then(function (response) {
                console.log("Single Market Data" ,response.data.data);
                setCampaignName(response.data.data[0].campaign_name);
                setSelectedDate(response.data.data[0].date);
                setEndDate(response.data.data[0].end_data)
                setInfluenceOffer(response.data.data[0].offer);
                setInfluencerVisit(response.data.data[0].influencer_visit);
                const products = response.data.data[0].product;
                const amount = products.map(product => product.amount[0]);
                const discount_type = response.data.data[0].discout_type;
                const productNames = products.map(product => product.product_name);
                const productIds = products.map(product => product.product_id.toString());
                const couponNames = products.map(product => product.coupon_name[0]);
                console.log("amount",amount)
                setSelectedInfluencer(prevState => ({
                    coupon_name: couponNames[0],
                    amount: amount[0],
                    discout_type: discount_type,
                    product_id: productIds.toString(),
                    product_name: productNames.toString()
                }));
                setSelectedProd(prevState => ({
                    coupon_name: couponNames,
                    amount: amount,
                    discout_type: discount_type,
                    product_id: productIds.toString(),
                    product_name: productNames.toString()
                }));
                console.log("couponNames", couponNames)
                setProductName(productNames);
                setProductIds(productIds);
                setSelectedCouponNames(couponNames);
                setUserData(response.data.data[0]);
                setSelectedCouponAmounts(response.data.data[0].product)
                setInfluenceFee(response.data.data[0].influencer_fee)
                setCampaignDesc(response.data.data[0].description)
            })
            .catch(function (error) {
                console.log(error)
            })
        }
    },[id])

    const changeStatus = (event) => {
        event.preventDefault();
        setLoading(true);
        axios.put(API.BASE_URL + 'draft/update/' + id + '/',{
            campaign_name: campaignName,
            description: campaignDesc,
            offer: influenceOffer,
            product_discount: selectedProd,
            influencer_fee: influenceFee,
            date: selectedDate,
            product_name: productName,
          },{
          headers: {
            Authorization: `Token 43272d3b1eb9b1f7beed87ee636d1079483a41ad`
          }
        })
        .then(function (response) {
          console.log("Changed Status", response)
          toast.success("Status Changed Successfully", { autoClose: 1000 });
          navigate('/market')
        })
        .catch(function (error) {
          console.log(error);
          toast.warn("Unable to edit. Please try again later", { autoClose: 1000 })
        })
        .finally(() => setLoading(false));
    }

    useEffect(() => {
        if(id?.length != 1) {
            const newCombinedInfo = [{
                amount: [selectedInfluencer?.amount],
                discout_type: [selectedInfluencer?.discout_type],
                coupon_name: [selectedInfluencer?.coupon_name],
                product_id: productIds.toString(),
                product_name: productName.toString(),
            }];
            setSelectedProd(newCombinedInfo);
        }
    }, [selectedInfluencer, productName]);

    console.log("PRDDDDDDDDD", productName)
    console.log("Coupons Name", selectedCoupon)
    console.log("Product Id", productIds)
    console.log("Product Details", selectedCouponAmounts)
    console.log("id",id)
    console.log("selectedInfluencer", selectedInfluencer)
    console.log("setSelectedProd", selectedProd)

  return (
    <div className="campaign-new p-4 page">
        {loading && <div className='d-flex loader-container flex-column'><div className='loader'><span></span></div> <p className='text-white'>Processing...</p></div>}
        <div className="campaign-new-container d-flex flex-column justify-content-center align-items-center">
            <Link to='/create' className={"button button-black d-flex me-auto back"}>
                <FontAwesomeIcon icon={faChevronLeft} style={{ color: "#000", width: "15px", height: "15px", marginRight: 5 }} />
                Back
            </Link>
            <h3 className='my-4 w-100'>{id?.length > 0 ? "Edit Campaign for Marketplace" : "Create Campaign for Marketplace"}</h3>
            
            <form action="" className='d-flex flex-wrap justify-content-between mt-5 w-100'>
                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Campaign name</label>
                    <input type="text" maxLength='30' onChange={handleCampaignNameChange} value={campaignName} />
                </div>

                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Influencer need to visit you</label>
                    <div className="input d-flex align-items-center">
                        <span className='d-flex align-items-center justify-content-center me-4'>
                            <input type="radio" id="yes" name="influencerVisit" value="Yes" checked={influencerVisit === "Yes"} onChange={handleInfluencerVisit} />
                            <label htmlFor="yes">Yes</label>
                        </span>
                        <span className='d-flex align-items-center justify-content-center'>
                            <input type="radio" id="no" name="influencerVisit" value="No" checked={influencerVisit === "No"} onChange={handleInfluencerVisit} />
                            <label htmlFor="no">No</label>
                        </span>
                    </div>

                </div>

                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Campaign start date</label>
                    <input type="date" min={today} onChange={handleDateChange} value={selectedDate} />
                </div>

                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Campaign end date</label>
                    <input type="date" min={selectedDate} onChange={handleEndDate} value={endDate} />
                </div>

                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Offer to influencers</label>
                    <div className="input d-flex align-items-center">
                        <span className='d-flex align-items-center justify-content-center me-4'>
                            <input type="radio" id="percentage" name="influenceOffer" value="percentage" checked={influenceOffer === "percentage"} onChange={handleInfluenceOffer} />
                            <label htmlFor="percentage">Commission</label>
                        </span>
                        <span className='d-flex align-items-center justify-content-center'>
                            <input type="radio" id="commission" name="influenceOffer" value="commission" checked={influenceOffer === "commission"} onChange={handleInfluenceOffer} />
                            <label htmlFor="commission">Fixed Fee</label>
                        </span>
                    </div>
                </div>

                <div className="input-container test d-flex flex-column mb-4 drop">
                    <label className="mb-3">Product</label>
                    <input
                        type="text"
                        placeholder="---Select an option---"
                        onClick={() => setShowList(!showList)}
                        value={productName}
                    />
                    {showList && (
                        <ul className="product-list">
                            {prodList?.length > 0 ? (
                                prodList?.map((name, i) => (
                                    <li
                                        key={i}
                                        onClick={() => {
                                            setProductName(name.title );
                                            setProductIds(name.id);
                                            setShowList(false);
                                        }}
                                        className={productName.includes(name.title) ? "active-prod" : ""}
                                    >
                                        {name.title}
                                    </li>
                                ))
                            ) : (
                                "No Products"
                            )}
                        </ul>
                    )}
                </div>

                {influenceOffer.length > 0 ? (
                    <div className="input-container d-flex flex-column mb-4">
                        <label className="mb-3">{influenceOffer === "percentage" ? "Commission (%)" : "Fixed Fee"}</label>
                        <input type="number" onWheel={(e) => e.target.blur()} value={influenceFee} onChange={(e) => {setInfluenceFee(e.target.value)}} />
                    </div>
                ): ""}

                {/* {productIds.length > 0&& (
                    <div className="input-container d-flex flex-column mb-4">
                        <label className="mb-3">Product URL</label>
                        <div className='product-urls'>
                            {productUrl?.map((url, index) => (
                                <a key={index} href={url} target="_blank">
                                    <FontAwesomeIcon icon={faSearch} style={{ color: "#5172fc", width: "15px", height: "15px", marginRight: 10 }} />
                                    {url}
                                </a>
                            ))}
                        </div>
                    </div>
                )} */}

                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Description</label>
                    <textarea
                        name=""
                        id=""
                        cols="30"
                        onChange={handleCampDesc}
                        value={campaignDesc}
                        // value={prodDesc.map((desc) => desc.description).join('\n')}
                        style={{ color: '#666' }}
                    ></textarea>
                </div>
            
                <div className="input-container d-flex coup flex-column mb-4 drop">
                    <label className='mb-3'>Select Coupon</label>
                    <input
                    type="text"
                    placeholder={
                        marketCoupons.length > 0
                        ? "---Select an option---"
                        : "---No Coupon Available---"
                    }
                    onClick={() => setShowInfluencerDropdown(!showInfluencerDropdown)}
                    value={selectedInfluencer ? selectedInfluencer.coupon_name : ""}
                    style={selectedInfluencer?.coupon_name != '' ? {fontWeight: 'bold', color: ''} : {}}
                    />
                    {showInfluencerDropdown && (
                    <ul className='product-list'>
                        {marketCoupons.map((influencer, i) => (
                        <li
                            className='influencer-box'
                            key={i}
                            onClick={() => handleInfluencerSelection(influencer)}
                        >
                            {influencer.coupon_name}
                        </li>
                        ))}
                    </ul>
                    )}
                </div>

                <div className="buttons d-flex justify-content-center">
                    
                    {id?.length > 0 ? 
                    <>
                        <button type='button' className='button button-black' onClick={(e) => {editCampaign(e)}}>Update Campaign</button>
                        {userData?.draft_status == true && (
                            <button className='button ms-4' onClick={(e) => {changeStatus(e)}}>Change Status to Pending</button>
                        )}
                    </>
                    :
                    <>
                        <button className='button button-black' onClick={createNewCampaignDraft}>Save in draft</button>
                        <button className='button ms-4' onClick={createNewCampaign}>Send to MarketPlace</button>
                    </>}
                </div>
            </form>
        </div>
    </div>
  );
}

export default CreateCampaign;