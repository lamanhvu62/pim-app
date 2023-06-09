// import { FORM_FIELD_TYPE } from 'constants/FormFieldType';
import { PIM_FIELD_DETAIL_FIELD_KEY, PIM_PRODUCT_DETAIL_FIELD_KEY } from 'aesirx-lib';
import { FORM_FIELD_TYPE } from 'constants/FormFieldType';
import { withFieldViewModel } from 'containers/FieldsPage/FieldViewModel/FieldViewModelContextProvider';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { Col, Nav, Row, Tab } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { renderingGroupFieldHandler } from 'utils/form';
const FieldsList = observer(
  class FieldsList extends Component {
    constructor(props) {
      super(props);
      this.viewModel = props.viewModel ? props.viewModel : null;
      this.state = { itemsByGroup: [], defaultActive: '' };
      this.fieldRef = [];
    }

    componentDidMount = async () => {
      this.viewModel.fieldListViewModel.handleFilter({
        'filter[type]': this.props.type,
        ...(this.props.formPropsData[PIM_PRODUCT_DETAIL_FIELD_KEY.PRODUCT_TYPE_ID] && {
          'filter[product_types]':
            this.props.formPropsData[PIM_PRODUCT_DETAIL_FIELD_KEY.PRODUCT_TYPE_ID],
        }),
        ...(this.props.productType && { 'filter[product_types]': this.props.productType }),
        'filter[published]': 1,
      });
      this.viewModel.fieldListViewModel.handleFilterList({ limit: 0 });
      await this.viewModel.fieldListViewModel.initializeDataCustom();
      if (this.props.fieldByGroup) {
        await this.viewModel.fieldListViewModel.getGroupList();
        this.setState((prevState) => {
          return {
            ...prevState,
            itemsByGroup: this.viewModel.fieldListViewModel.groupList.map((item) => {
              let itemsByGroup = this.viewModel.fieldListViewModel.items.filter(
                (value) => value[PIM_FIELD_DETAIL_FIELD_KEY.FIELD_GROUP_ID] === item.id
              );
              return { group: item.id, label: item.label, fields: itemsByGroup };
            }),
            defaultActive: 'group-' + this.viewModel.fieldListViewModel.groupList[0]?.id,
          };
        });
      } else {
        this.setState((prevState) => {
          return {
            ...prevState,
            itemsByGroup: [{ group: null, fields: this.viewModel.fieldListViewModel.items }],
          };
        });
      }

      // if (
      //   Object.prototype.hasOwnProperty.call(
      //     this.props.formPropsData,
      //     PIM_FIELD_DETAIL_FIELD_KEY.CUSTOM_FIELDS
      //   )
      // ) {
      //   Object.assign(this.props.formPropsData, {
      //     [PIM_FIELD_DETAIL_FIELD_KEY.CUSTOM_FIELDS]: {},
      //   });
      // }
      console.log('this.props.formPropsData', this.props.formPropsData);
    };

    handleActiveTabRequiredField() {
      if (this.props.requiredField) {
        let requiredFields = Object.keys(this.props.validator.fields).find(
          (key) => this.props.validator.fields[key] === false
        );
        let groupRequired = this.viewModel.fieldListViewModel.items.find(
          (o) => o[PIM_FIELD_DETAIL_FIELD_KEY.NAME] === requiredFields
        )?.field_group_id;
        if (this.state.defaultActive !== 'group-' + groupRequired) {
          this.setState((prevState) => {
            return {
              ...prevState,
              defaultActive: 'group-' + groupRequired,
            };
          });
        }
      }
    }

    handleScrollToRequiredField() {
      if (this.props.requiredField) {
        let requiredFields = Object.keys(this.props.validator.fields).find(
          (key) => this.props.validator.fields[key] === false
        );
        let fieldRequired = this.viewModel.fieldListViewModel.items.find(
          (o) => o[PIM_FIELD_DETAIL_FIELD_KEY.NAME] === requiredFields
        );
        if (this.fieldRef[fieldRequired?.fieldcode]) {
          setTimeout(() => {
            this.fieldRef[fieldRequired?.fieldcode] &&
              this.fieldRef[fieldRequired?.fieldcode].scrollIntoView();
          }, 500);
        }
      }
    }

    componentDidUpdate = (prevProps) => {
      if (this.props.requiredField !== prevProps.requiredField) {
        this.props.fieldByGroup && this.handleActiveTabRequiredField();
        this.handleScrollToRequiredField();
      }
    };

    render() {
      const { t } = this.props;
      const generateFormSetting = [
        ...this.state.itemsByGroup?.map((group) => {
          return {
            group: group?.group,
            fields: [
              ...group.fields?.map((field) => {
                let selectedValue = '';
                if (
                  field[PIM_FIELD_DETAIL_FIELD_KEY.TYPE] === FORM_FIELD_TYPE.SELECTION ||
                  field[PIM_FIELD_DETAIL_FIELD_KEY.TYPE] === FORM_FIELD_TYPE.RADIO ||
                  field[PIM_FIELD_DETAIL_FIELD_KEY.TYPE] === FORM_FIELD_TYPE.CHECKBOX
                ) {
                  let fieldValue =
                    field[PIM_FIELD_DETAIL_FIELD_KEY.TYPE] === FORM_FIELD_TYPE.SELECTION &&
                    this.props.formPropsData[PIM_FIELD_DETAIL_FIELD_KEY.CUSTOM_FIELDS][
                      field[PIM_FIELD_DETAIL_FIELD_KEY.FIELD_CODE]
                    ]
                      ? this.props.formPropsData[PIM_FIELD_DETAIL_FIELD_KEY.CUSTOM_FIELDS][
                          field[PIM_FIELD_DETAIL_FIELD_KEY.FIELD_CODE]
                        ][0]
                      : this.props.formPropsData[PIM_FIELD_DETAIL_FIELD_KEY.CUSTOM_FIELDS][
                          field[PIM_FIELD_DETAIL_FIELD_KEY.FIELD_CODE]
                        ];
                  if (field[PIM_FIELD_DETAIL_FIELD_KEY.PARAMS]?.multiple === '1') {
                    selectedValue = fieldValue?.length
                      ? fieldValue.map((item) => {
                          return {
                            label: field[PIM_FIELD_DETAIL_FIELD_KEY.OPTIONS].find(
                              (x) => x.value === item
                            )?.label,
                            value: item,
                          };
                        })
                      : null;
                  } else {
                    selectedValue = this.props.formPropsData[
                      PIM_FIELD_DETAIL_FIELD_KEY.CUSTOM_FIELDS
                    ][field[PIM_FIELD_DETAIL_FIELD_KEY.FIELD_CODE]]?.length
                      ? {
                          label: field[PIM_FIELD_DETAIL_FIELD_KEY.OPTIONS].find(
                            (x) => x.value === fieldValue
                          )?.label,
                          value: fieldValue,
                        }
                      : null;
                  }
                } else {
                  selectedValue =
                    this.props.formPropsData[PIM_FIELD_DETAIL_FIELD_KEY.CUSTOM_FIELDS][
                      field[PIM_FIELD_DETAIL_FIELD_KEY.FIELD_CODE]
                    ] ?? null;
                }
                return {
                  label: field[PIM_FIELD_DETAIL_FIELD_KEY.NAME],
                  key: field[PIM_FIELD_DETAIL_FIELD_KEY.FIELD_CODE],
                  type: field[PIM_FIELD_DETAIL_FIELD_KEY.TYPE],
                  getValueSelected: selectedValue,
                  getDataSelectOptions: field[PIM_FIELD_DETAIL_FIELD_KEY.OPTIONS],
                  handleChange: (data) => {
                    if (field[PIM_FIELD_DETAIL_FIELD_KEY.TYPE] === FORM_FIELD_TYPE.SELECTION) {
                      if (field[PIM_FIELD_DETAIL_FIELD_KEY.PARAMS]?.multiple === '1') {
                        let convertData = data.map((item) => item?.value);
                        this.props.detailViewModal.handleFormPropsData(
                          [PIM_FIELD_DETAIL_FIELD_KEY.CUSTOM_FIELDS],
                          { [field[PIM_FIELD_DETAIL_FIELD_KEY.FIELD_CODE]]: [convertData] }
                        );
                      } else {
                        this.props.detailViewModal.handleFormPropsData(
                          [PIM_FIELD_DETAIL_FIELD_KEY.CUSTOM_FIELDS],
                          { [field[PIM_FIELD_DETAIL_FIELD_KEY.FIELD_CODE]]: [data.value] }
                        );
                      }
                    } else if (field[PIM_FIELD_DETAIL_FIELD_KEY.TYPE] === FORM_FIELD_TYPE.IMAGE) {
                      this.props.detailViewModal.handleFormPropsData(
                        [PIM_FIELD_DETAIL_FIELD_KEY.CUSTOM_FIELDS],
                        { [field[PIM_FIELD_DETAIL_FIELD_KEY.FIELD_CODE]]: data }
                      );
                    } else if (
                      field[PIM_FIELD_DETAIL_FIELD_KEY.TYPE] === FORM_FIELD_TYPE.CHECKBOX
                    ) {
                      this.props.detailViewModal.handleFormPropsData(
                        [PIM_FIELD_DETAIL_FIELD_KEY.CUSTOM_FIELDS],
                        { [field[PIM_FIELD_DETAIL_FIELD_KEY.FIELD_CODE]]: data ?? '' }
                      );
                    } else if (field[PIM_FIELD_DETAIL_FIELD_KEY.TYPE] === FORM_FIELD_TYPE.EDITOR) {
                      this.props.detailViewModal.handleFormPropsData(
                        [PIM_FIELD_DETAIL_FIELD_KEY.CUSTOM_FIELDS],
                        { [field[PIM_FIELD_DETAIL_FIELD_KEY.FIELD_CODE]]: data }
                      );
                    } else {
                      this.props.detailViewModal.handleFormPropsData(
                        [PIM_FIELD_DETAIL_FIELD_KEY.CUSTOM_FIELDS],
                        { [field[PIM_FIELD_DETAIL_FIELD_KEY.FIELD_CODE]]: data.target.value }
                      );
                    }
                  },
                  className:
                    field[PIM_FIELD_DETAIL_FIELD_KEY.TYPE] === FORM_FIELD_TYPE.IMAGE ||
                    field[PIM_FIELD_DETAIL_FIELD_KEY.TYPE] === FORM_FIELD_TYPE.EDITOR
                      ? 'col-lg-12'
                      : this.props.fieldClass,

                  // ...(field[PIM_FIELD_DETAIL_FIELD_KEY.RELEVANCE] === 2 && {
                  //   required: true,
                  //   validation: 'required',
                  // }),
                  isMulti:
                    (field[PIM_FIELD_DETAIL_FIELD_KEY.TYPE] === FORM_FIELD_TYPE.IMAGE ||
                      field[PIM_FIELD_DETAIL_FIELD_KEY.TYPE] === FORM_FIELD_TYPE.LIST ||
                      field[PIM_FIELD_DETAIL_FIELD_KEY.TYPE] === FORM_FIELD_TYPE.SELECTION) &&
                    field[PIM_FIELD_DETAIL_FIELD_KEY.PARAMS]?.multiple === '1',
                  isVideo:
                    field[PIM_FIELD_DETAIL_FIELD_KEY.TYPE] === FORM_FIELD_TYPE.IMAGE &&
                    field[PIM_FIELD_DETAIL_FIELD_KEY.PARAMS]?.webservice?.name ===
                      'aesir_dam_video',
                  isEditor:
                    field[PIM_FIELD_DETAIL_FIELD_KEY.TYPE] === FORM_FIELD_TYPE.EDITOR &&
                    field[PIM_FIELD_DETAIL_FIELD_KEY.PARAMS]?.editor === 'none'
                      ? false
                      : true,
                  ...(field[PIM_FIELD_DETAIL_FIELD_KEY.TYPE] === FORM_FIELD_TYPE.EDITOR && {
                    placeholder: t('txt_type'),
                  }),
                  creatable:
                    field[PIM_FIELD_DETAIL_FIELD_KEY.PARAMS]?.filter_type === 'creatable'
                      ? true
                      : false,
                  value:
                    this.props.formPropsData[PIM_FIELD_DETAIL_FIELD_KEY.CUSTOM_FIELDS]
                      .product_width,
                  format: field[PIM_FIELD_DETAIL_FIELD_KEY.PARAMS]?.number_units,
                  placeholder: field[PIM_FIELD_DETAIL_FIELD_KEY.PARAMS]?.placeholder
                    ? field[PIM_FIELD_DETAIL_FIELD_KEY.PARAMS]?.placeholder
                    : null,
                  maxLength: field[PIM_FIELD_DETAIL_FIELD_KEY.PARAMS]?.limit ?? null,
                  blurred: () => {
                    this.props.validator.showMessageFor(field[PIM_FIELD_DETAIL_FIELD_KEY.NAME]);
                  },
                  ref: (ref) => {
                    this.fieldRef[field[PIM_FIELD_DETAIL_FIELD_KEY.FIELD_CODE]] = ref;
                  },
                };
              }),
            ],
          };
        }),
      ];

      return (
        <>
          {this.props.fieldByGroup ? (
            <Tab.Container
              id="left-tabs-fields"
              activeKey={`${this.state.defaultActive}`}
              onSelect={(key) => {
                this.setState({
                  defaultActive: key,
                });
              }}
            >
              <Row className="gx-24">
                <Col lg={3}>
                  <div className="fs-14 pb-16 mb-1 border-bottom fw-semibold">
                    {t('txt_field_group')}
                  </div>
                  <Nav variant="tabs" className="flex-column">
                    {this.state.itemsByGroup?.map((group, key) => {
                      return (
                        <Nav.Item key={key}>
                          <Nav.Link eventKey={`group-${group.group}`}>{group.label}</Nav.Link>
                        </Nav.Item>
                      );
                    })}
                  </Nav>
                </Col>
                <Col lg={9}>
                  <Tab.Content>
                    {this.state.itemsByGroup?.map((group, key) => {
                      return (
                        <Tab.Pane eventKey={`group-${group.group}`} key={key}>
                          <h3 className="mb-24 fw-bold">{group.label}</h3>
                          <div className="row">
                            {Object.keys(generateFormSetting)
                              .map((groupIndex) => {
                                if (generateFormSetting[groupIndex].group === group.group) {
                                  return [...Array(generateFormSetting[groupIndex])].map(
                                    (group) => {
                                      return renderingGroupFieldHandler(
                                        group,
                                        this.props.validator
                                      );
                                    }
                                  );
                                }
                              })
                              .reduce((arr, el) => {
                                return arr.concat(el);
                              }, [])}
                          </div>
                        </Tab.Pane>
                      );
                    })}
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          ) : (
            Object.keys(generateFormSetting)
              .map((groupIndex) => {
                return [...Array(generateFormSetting[groupIndex])].map((group) => {
                  return renderingGroupFieldHandler(group, this.props.validator);
                });
              })
              .reduce((arr, el) => {
                return arr.concat(el);
              }, [])
          )}
        </>
      );
    }
  }
);

export default withTranslation()(withFieldViewModel(FieldsList));
