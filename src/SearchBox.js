import React, { Component } from 'react'
import { InputGroup, Button, FormControl } from 'react-bootstrap'
import PropTypes from 'prop-types'

export default class SearchBox extends Component {
    constructor(props) {
        super(props)
        this.searchText = null
        this.state = {
            searchText: "",
            searchedValue: "",
            enableAutoSuggestion: false,
            autoSuggestValue: ""
        }
        this.onSearchTextChange = this.onSearchTextChange.bind(this)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.searchText !== '' && this.state.searchText === '' && this.state.searchedValue === '') {
            this.props.setSearchText('');
        }
    }

    onSearchTextChange = (e) => {
        if (e.target.value === '' || !e.target.value) {
            this.setState({
                searchText: '',
                enableAutoSuggestion: false,
                autoSuggestValue: '',
                searchedValue: ''
            })
        } else {
            let oldText = this.state.searchText;
            let regex = /^[~!@#$%^&*()+=\[\]{};\':"\\|,<>\/?]*$/
            let newText = ''
            if (regex.test(e.target.value)) {
                newText = oldText
                this.searchText.value = oldText
            } else {
                newText = e.target.value
                this.searchText.value = newText
            }
            this.setState({
                searchText: newText,
                enableAutoSuggestion: true,
                autoSuggestValue: newText
            })
            if (!this.props.displaySearchIcon) {
                this.props.setSearchText(e.target.value)
            }
        }

    }

    onSearchClick = () => {
        if (this.props.displaySearchIcon) {
            this.setState({
                enableAutoSuggestion: false,
                searchedValue: this.searchText.value
            })
            this.props.setSearchText(this.searchText.value);
        }
    }

    onSearchResultClick = (searchedValue) => {
        this.searchText.value = searchedValue
        this.setState({
            enableAutoSuggestion: false,
            searchedValue: searchedValue
        })
        this.props.setSearchText(searchedValue);
    }


    render() {
        const { displaySearchIcon, containerStyle, searchBoxInputStyle, searchButtonStyle } = this.props
        return (
            <div style={{ ...containerStyle }} >
                <InputGroup>
                    <FormControl
                        placeholder="Search"
                        type="text"
                        ref={userInput => { this.searchText = userInput }}
                        onChange={(e) => { this.onSearchTextChange(e) }}
                        style={{ ...searchBoxInputStyle }}
                    />
                    {
                        displaySearchIcon
                            ? <InputGroup.Append>
                                <Button
                                    style={searchButtonStyle}
                                    onClick={this.onSearchClick}
                                >
                                    <img src={process.env.PUBLIC_URL + "/data/icons/search.svg"} alt="search" title="search" />
                                </Button>
                            </InputGroup.Append>
                            : <></>
                    }
                </InputGroup>
            </div>
        )
    }
}

SearchBox.propTypes = {
    setSearchText: PropTypes.func,
    searchedClick: PropTypes.func,
    displaySearchIcon: PropTypes.bool,
    searchBoxStyle: PropTypes.oneOf(['rect', 'rounded'])
}