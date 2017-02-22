module Photos.Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)


main : Program Never Model Msg
main =
    Html.program
        { init = ( initialModel, Cmd.none )
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }


type Msg
    = PhotoSelected Photo
    | PhotoClosed
    | NextPhoto
    | PreviousPhoto


type alias Photo =
    { index : Int
    , url : String
    }


type alias Model =
    { selectedPhoto : Maybe Photo
    , previousPhotos : List Photo
    , nextPhotos : List Photo
    , photos : List Photo
    }


initialModel : Model
initialModel =
    { photos = List.map createPhoto <| List.range 1 49
    , selectedPhoto = Nothing
    , previousPhotos = []
    , nextPhotos = []
    }


createPhoto : Int -> Photo
createPhoto photoId =
    { index = photoId
    , url = buildPhotoUrl photoId
    }


buildPhotoUrl : Int -> String
buildPhotoUrl photoId =
    "/assets/images/photos/" ++ toString photoId ++ ".jpg"


handleNextPhoto : Model -> Model
handleNextPhoto model =
    let
        selectedPhoto =
            List.head model.nextPhotos

        nextPhotos =
            case selectedPhoto of
                Just photo ->
                    List.drop 1 model.nextPhotos

                Nothing ->
                    model.nextPhotos

        previousPhotos =
            case ( selectedPhoto, model.selectedPhoto ) of
                ( Just newSelectedPhoto, Just oldSelectedPhoto ) ->
                    oldSelectedPhoto :: model.previousPhotos

                ( _, _ ) ->
                    model.previousPhotos
    in
        { model
            | selectedPhoto = selectedPhoto
            , previousPhotos = previousPhotos
            , nextPhotos = nextPhotos
        }


handlePreviousPhoto : Model -> Model
handlePreviousPhoto model =
    let
        selectedPhoto =
            List.head model.previousPhotos

        nextPhotos =
            case ( selectedPhoto, model.selectedPhoto ) of
                ( Just newSelectedPhoto, Just oldSelectedPhoto ) ->
                    oldSelectedPhoto :: model.nextPhotos

                ( _, _ ) ->
                    model.nextPhotos

        previousPhotos =
            case selectedPhoto of
                Just photo ->
                    List.drop 1 model.previousPhotos

                Nothing ->
                    model.previousPhotos
    in
        { model
            | selectedPhoto = selectedPhoto
            , previousPhotos = previousPhotos
            , nextPhotos = nextPhotos
        }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        PhotoSelected photo ->
            ( { model
                | selectedPhoto = Just photo
                , previousPhotos = (List.drop 1 << List.reverse << List.take photo.index) model.photos
                , nextPhotos = List.drop photo.index model.photos
              }
            , Cmd.none
            )

        PhotoClosed ->
            ( { model | selectedPhoto = Nothing }, Cmd.none )

        NextPhoto ->
            ( handleNextPhoto model, Cmd.none )

        PreviousPhoto ->
            ( handlePreviousPhoto model, Cmd.none )


renderPhotoCol : Photo -> Html Msg
renderPhotoCol photo =
    div [ class "col col-sm-3" ]
        [ div [ class "thumbnail" ]
            [ img [ onClick <| PhotoSelected photo, src photo.url ] []
            ]
        ]


renderPhotoRows : List Photo -> List (Html Msg)
renderPhotoRows photos =
    case photos of
        [] ->
            [ span [] [] ]

        first :: [] ->
            [ div [ class "row" ]
                [ renderPhotoCol first
                ]
            ]

        first :: second :: [] ->
            [ div [ class "row" ]
                [ renderPhotoCol first
                , renderPhotoCol second
                ]
            ]

        first :: second :: third :: [] ->
            [ div [ class "row" ]
                [ renderPhotoCol first
                , renderPhotoCol second
                , renderPhotoCol third
                ]
            ]

        first :: second :: third :: fourth :: rest ->
            [ div [ class "row" ]
                [ renderPhotoCol first
                , renderPhotoCol second
                , renderPhotoCol third
                , renderPhotoCol fourth
                ]
            ]
                ++ renderPhotoRows rest


view : Model -> Html Msg
view model =
    div [ class "container photo-container" ] <|
        renderPhotoRows model.photos
            ++ case model.selectedPhoto of
                Just selectedPhoto ->
                    [ div [ class "gallery-overlay", onClick PhotoClosed ]
                        []
                    , div
                        [ class "gallery" ]
                        [ div [ class "gallery-closeTarget", onClick PhotoClosed ] []
                        , div [ class "col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2" ]
                            [ img [ class "media-image img img-responsive", src selectedPhoto.url ] []
                            ]
                        ]
                    ]

                --     [ class "gallery" ]
                --     [ div [ class "gallery-closeTarget" ] []
                --     , div [ class "gallery-content", style [ ( "width", "800px" ), ( "min-height", "0px" ) ] ]
                --         [ button [ class "modal-btn modal-close", onClick PhotoClosed ]
                --             [ span [ class "icon icon--close icon--large" ]
                --                 [ i [ class "fa fa-times" ] []
                --                 ]
                --             ]
                --         , div [ class "gallery-media" ]
                --             [ img [ class "media-image img img-responsive", src selectedPhoto.url ] []
                --             ]
                --         , div [ class "galleryNav galleryNav--prev" ]
                --             [ span [ class "galleryNav-handle galleryNav-handle--prev" ]
                --                 [ span [ class "icon icon--large icon--left", onClick PreviousPhoto ]
                --                     [ i [ class "fa fa-arrow-left" ] []
                --                     ]
                --                 ]
                --             ]
                --         , div [ class "galleryNav galleryNav--next" ]
                --             [ span [ class "galleryNav-handle galleryNav-handle--next" ]
                --                 [ span [ class "icon icon--large", onClick NextPhoto ]
                --                     [ i [ class "fa fa-arrow-right" ] []
                --                     ]
                --                 ]
                --             ]
                --         ]
                --     ]
                -- ]
                Nothing ->
                    [ span [] [] ]
