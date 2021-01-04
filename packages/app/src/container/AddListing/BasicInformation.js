import React, { useRef } from "react";
import { Form } from "react-bootstrap";
import { Button } from "components/UI/Button/Button";

const BasicInformation = ({ setStep, formData, setFormData }) => {
  const categoryRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();
  const handleSubmit = (event) => {
    event.preventDefault();
    setFormData({
      ...formData,
      category: categoryRef.current.value,
      title: titleRef.current.value,
      description: descriptionRef.current.value,
    });
    setStep();
  };

  return (
    <>
      <h2>Add a listing</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Skill Category</Form.Label>
          <Form.Control as="select" custom ref={categoryRef}>
            <option value="General Programming">General Programming</option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="Fine Art">Fine Art</option>
            <option value="Film">Film</option>
            <option value="Web Development">Web Development</option>
            <option value="Singing">Singing</option>
            <option value="Musical Instruments">Musical Instruments</option>
            <option value="Investing">Investing</option>
            <option value="Marketing">Marketing</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="title">
          <Form.Label>Skill Page Title</Form.Label>
          <Form.Control
            type="title"
            placeholder="Guitar, Programming in React..."
            ref={titleRef}
            required
          />
        </Form.Group>
        <Form.Group controlId="textarea">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" ref={descriptionRef} required />
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
    </>
    // <form onSubmit={handleSubmit(onSubmit)}>
    //   <FormContent>
    //     <FormHeader>
    //       <Title>Step 1: Start with the basics</Title>
    //     </FormHeader>
    //     <Row gutter={30}>
    //       <Col sm={12}>
    //         <FormControl
    //           label="Hotel Name"
    //           htmlFor="hotelName"
    //           error={errors.hotelName && <span>This field is required!</span>}
    //         >
    //           <Controller
    //             as={<Input />}
    //             id="hotelName"
    //             name="hotelName"
    //             defaultValue={state.data.hotelName}
    //             control={control}
    //             placeholder="Write your hotel name here"
    //             rules={{
    //               required: true,
    //             }}
    //           />
    //         </FormControl>
    //       </Col>
    //       <Col sm={12}>
    //         <FormControl
    //           label="Price Per Night (USD)"
    //           htmlFor="pricePerNight"
    //           error={
    //             errors.pricePerNight && (
    //               <>
    //                 {errors.pricePerNight?.type === 'required' && (
    //                   <span>This field is required!</span>
    //                 )}
    //                 {errors.pricePerNight?.type === 'pattern' && (
    //                   <span>Please enter only number!</span>
    //                 )}
    //               </>
    //             )
    //           }
    //         >
    //           <Controller
    //             as={<InputNumber />}
    //             id="pricePerNight"
    //             name="pricePerNight"
    //             defaultValue={state.data.pricePerNight}
    //             control={control}
    //             placeholder="00.00"
    //             rules={{
    //               required: true,
    //               pattern: /^[0-9]*$/,
    //             }}
    //           />
    //         </FormControl>
    //       </Col>
    //     </Row>
    //     <FormControl
    //       label="Hotel Description"
    //       htmlFor="hotelDescription"
    //       error={
    //         errors.hotelDescription && <span>This field is required!</span>
    //       }
    //     >
    //       <Controller
    //         as={<Input.TextArea rows={5} />}
    //         id="hotelDescription"
    //         name="hotelDescription"
    //         defaultValue={state.data.hotelDescription}
    //         control={control}
    //         placeholder="Tell people about your hotel, room, location & amenities"
    //         rules={{
    //           required: true,
    //         }}
    //       />
    //     </FormControl>
    //     <FormControl
    //       label="How many guests can your hotel accommodate?"
    //       error={errors.guest && <span>This field is required!</span>}
    //     >
    //       <InputIncDec
    //         name="guest"
    //         value={quantity.guest}
    //         onChange={handleOnChange('guest')}
    //         increment={() => handleIncrement('guest')}
    //         decrement={() => handleDecrement('guest')}
    //       />
    //     </FormControl>
    //     <FormControl
    //       label="How many beds can guests use?"
    //       error={errors.bed && <span>This field is required!</span>}
    //     >
    //       <InputIncDec
    //         name="bed"
    //         value={quantity.bed}
    //         onChange={handleOnChange('bed')}
    //         increment={() => handleIncrement('bed')}
    //         decrement={() => handleDecrement('bed')}
    //       />
    //     </FormControl>
    //   </FormContent>
    //   <FormAction>
    //     <div className="inner-wrapper">
    //       <Button type="primary" htmlType="submit">
    //         Next
    //       </Button>
    //     </div>
    //   </FormAction>
    // </form>
  );
};

export default BasicInformation;
